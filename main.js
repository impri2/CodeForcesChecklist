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
        const filterbtn=  document.querySelector('#filterbtn')
        filterbtn.disabled=false
            filterbtn.addEventListener('click',(event)=>{
                const minval=   parseInt(document.querySelector('.minRating').value)
                const maxval=parseInt(document.querySelector('.maxRating').value)
                filterProblems(minval,maxval)

            })
    }
)
