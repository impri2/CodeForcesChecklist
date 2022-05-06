const CODEFORCES_URL="https://codeforces.com/api/"
const PROBLEMS_URL="problemset.problems?lang=en"
const CONTESTS_URL="contest.list?lang=en"
const problemTable=document.querySelector("table")

function alphabetToNumber(a){
    return a.charCodeAt(0)-65
}

async function fetchProblems(){
    const problems=await fetch(CODEFORCES_URL+PROBLEMS_URL)
    if(!problems.ok)throw "failed to load data"
    return problems.json()
}
async function fetchSubmissionData(handle){
   const submissions= await fetch(` https://codeforces.com/api/user.status?handle=${handle}&lang=en`)
    if(!submissions.ok)throw "failed to get data"
    return submissions.json()
   
}
async function getRatingData(){
    const problems=await fetchProblems()
    if(problems.status!=='OK')throw "failed to load data"
    const result=new Map()
    problems.result.problems.forEach(element=>{
        if(!element.hasOwnProperty('rating'))return
        if(!result.has(element.rating)){
            result.set(element.rating,[])
        }
        let problemObject={name:element.name}
        if(element.hasOwnProperty('contestId')){
            const problemLink=`https://codeforces.com/contest/${element.contestId}/problem/${element.index}`
            problemObject.link=problemLink
        }
        result.get(element.rating).push(problemObject)
    }
    )
    return result
}
async function getSolvedProblems(handle){
    const submissions=await fetchSubmissionData(handle)
    const result=new Set()
    submissions.result.forEach(element=>{
     
        
        if(element.verdict==="OK"){
           result.add(element.problem.name)
        }
    })
       console.log(result)
    return result
}
function createTableCells(tbody,r,c){
    for(let i=0;i<r;i++){
        const row=document.createElement('tr')
        tbody.appendChild(row)
        for(let j=0;j<c;j++){
            row.appendChild(document.createElement('td'))
        }
        
    }
}
function renderSolvedProblems(data){
    let l = document.getElementsByClassName("table-success");
while (l.length)
    l[0].classList.remove("table-success");
    const tbody=problemTable.querySelector('tbody')
    tbody.childNodes.forEach(
        element=>{
            
            element.childNodes.forEach(
                td=>{
                    let name=""
                    if(td.childNodes.length==1){
                    
                        name=td.querySelector('a').textContent
                    }
                    else{
                        name=td.textContent
                    }
                    if(data.has(name)){
                        td.classList.add('table-success')
                    }
                }
            )
        }
    )
}
 function filterProblems(minRating,maxRating){
problemTable.querySelectorAll('tr').forEach((element)=>{
    element.querySelectorAll('td').forEach((td,index)=>{
        const indexRating=index*100+800
        console.log(indexRating)
        if(minRating<=indexRating && indexRating<=maxRating)td.style.removeProperty('display')
        else td.style.display='none'
    })
  
})
}
getRatingData().then(
    data=>{
        headRow=problemTable.querySelector('thead tr')
        for(let i=800;i<=3500;i+=100){
            const td=document.createElement('td')
            td.textContent=i.toString()
            headRow.appendChild(td)
        }
        rowNum=0
        for(let i=800;i<=3500;i+=100){
            
            rowNum=Math.max(data.get(i).length,rowNum)
        }
        createTableCells(problemTable.querySelector('tbody'),rowNum,28)
        for(let i=800;i<=3500;i+=100){
           
            data.get(i).forEach((element,index,array)=>{
                let tr=problemTable.querySelector(`tbody tr:nth-child(${index+1})`)
                let td=tr.querySelector(`td:nth-child(${(i-700)/100})`)
                if(element.hasOwnProperty('link')){
                    const link=document.createElement('a')
                    link.href=element.link
                    link.textContent=element.name
                    link.target='_blank'
                    td.appendChild(link)
                }else{td.textContent=element.name}
            }

            
            )
        }
        document.querySelector('.loading').remove()
        const searchbtn=document.querySelector('#searchbtn')
        searchbtn.disabled=false
        searchbtn.addEventListener('click',event=>{
       
            getSolvedProblems(document.querySelector('.handleinput').value).then(
                data=>{
                    renderSolvedProblems(data)
                }
            )
            .catch(
                (reason)=>{
                    alert("an error has occurred")
                }
            )
           
        })
        const circle=document.querySelector('.circle')
const circle2=document.querySelector('.circle2')
function dragElement(element,initvalue){
let pos1=0,pos2=0

let value=initvalue
element.dataset.value=value
element.onmousedown=(e)=>{
    console.log("mouse down")
    e.preventDefault()
    pos2=e.clientX
    
    document.onmousemove=(ev1)=>{
        ev1.preventDefault()
        pos1=pos2-ev1.clientX
        pos2=ev1.clientX
        let val=element.offsetLeft-pos1
        const minx=element.parentNode.offsetLeft
        const maxx=element.parentNode.offsetLeft+element.parentNode.clientWidth-element.clientWidth
        val=Math.max(val,minx)
        val=Math.min(val,maxx)
        element.style.left=(val)+"px"
        let newvalue=Math.round((val-minx)/(maxx-minx)*27)*100+800
        if(newvalue!==value){
           
            value=newvalue
            element.dataset.value=value
            filterProblems(Math.min(parseInt(circle.dataset.value),parseInt(circle2.dataset.value)),Math.max(parseInt(circle.dataset.value),parseInt(circle2.dataset.value)))
        }
        element.textContent=newvalue
        
     
      
    }
    document.onmouseup=(ev2)=>{
        document.onmousemove=null
        document.onmouseup=null
    }
}
}
console.log(circle.parentNode.offsetTop)

document.querySelector('.line').style.display='block';
circle.style.display='block';
circle2.style.display='block';
circle.style.top=circle.parentNode.offsetTop+"px"
circle2.style.top=circle2.parentNode.offsetTop+"px"
circle2.style.left=(circle2.parentNode.offsetLeft+circle2.parentNode.clientWidth-circle2.clientWidth)+"px"
dragElement(circle,800)
dragElement(circle2,3500)
    }
)
