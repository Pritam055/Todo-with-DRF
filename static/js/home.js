 

let csrfToken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
let apiEndPoint = "http://127.0.0.1:8000/api/tasks/";
let form = document.getElementById("form");

// get all task
const getAllTask = async() => {
    try{
        const response = await fetch(apiEndPoint);
        if(response.status!=200){
            throw new Error(`Something went wrong, Status code: ${response.status}`);
        }
        const tasks = await response.json();
        let output = `
        <table class="table text-center">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Complete</th> 
                <th></th>
                </tr>
            </thead>
            <tbody>
                ${tasks.map(task => `
                    <tr>
                        <th scope="row">${task.id}</th>
                        <td>${task.completed?`<s style="color:red"><span style="color:black">${task.title}<span><s>`:`${task.title}`}</td>
                        <td>${task.completed}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-info edit" onclick="getTask(this)" id=${task.id} >Edit</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(this)" id=${task.id} >Delete</button>
                        </td> 
                    </tr>`).join("\n")}
            </tbody>
        </table>
        `;
        document.getElementById("table").innerHTML = output;
    }catch(error){
        console.log(error);
    }
};

getAllTask();

// post task
const postTask = async(newTask) => {
    try{
        const response = await fetch(apiEndPoint, {
            method:"POST",
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": csrfToken
            },
            body: JSON.stringify(newTask)
        });
        if(response.status != 201){
            throw new Error(`Something went wrong, Status code: ${response.status}`);
        }
        const task =await response.json();
        return task;
    }catch(error){
        console.log(error);
    }
}

// get task by id
const getTaskById = async(id)=>{
    try{
        const response = await fetch(`${apiEndPoint}${id}`);
        if(response.status != 200){
            throw new Error(`Something went wrong, Status code: ${response.status}`);
        }
        const task = await response.json();
        return task;
    }catch(error){
        console.log(error);
    }
}

// updating task
const updateTask = async (newTask, id) => {
    try{ 
        const response = await fetch(`${apiEndPoint}${id}/`,{
            method:"PUT",
            body:JSON.stringify(newTask),
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": csrfToken
            }
        })
        if(response.status != 200){
            throw new Error(`Something went wrong, Status code: ${response.status}`);
        }
        const task = await response.json();
        return task;
    }catch(error){
        console.log(error);
    }
}

// -----------button events------------

// submit form data
form.addEventListener('submit', async(e)=>{
    e.preventDefault();
    const title = e.target.title.value;  
    const completed = e.target.completed.checked;
    const newTask = {
                        "title": title,
                        "completed": completed
                    };  
    if(e.target.taskId){
        const taskId = e.target.taskId.value; 
        const updatedTask = await updateTask(newTask, taskId);
        console.log(updatedTask);
        form.removeChild(e.target.taskId);
        form.reset();
    }else{
        
        console.log(newTask)
        const task = await postTask(newTask);
        console.log(task);
        form.reset();
    }
    getAllTask();
})

// get edit task
async function getTask(btn){ 
    const id = btn.id;
    let task = await getTaskById(id); 
    form.title.value = task.title;
    form.completed.checked = task.completed;  

    if(form.taskId){ 
        form.taskId.value = task.id;
    }else{
        let newInputElement = document.createElement("input");
        newInputElement.name ="taskId";  
        newInputElement.value = task.id;
        newInputElement.type = "hidden"; 
        form.appendChild(newInputElement);
        form.submit.value = "Update Task";
    }    
}
 
// delete task
function deleteTask(btn){
    const id = btn.id;
    fetch(`${apiEndPoint}${id}/`,{
        method:"DELETE",
        headers: {
            "Content-type":"application/json",
            "X-CSRFToken": csrfToken
        }
    })
    .then((resp) => resp.json())
    .then((data) => {
        console.log(data);
        getAllTask();
    })
}
 