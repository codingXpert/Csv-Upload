//for searching a particular row ina table
function search() {
    var rows = document.getElementsByTagName('tr');
    for(let j = 0;j < rows.length; j++ ){
        rows[j].style.backgroundColor = "white";
    }
    var name = document.getElementById("searchForm").elements["searchItem"].value;
    var pattern = name.toLowerCase();
    var targetId = "";
  
    var divs = document.getElementsByClassName("col-md-2");
    for (let i = 0; i < divs.length; i++) {
       var index = divs[i].innerText.toLowerCase().indexOf(pattern);
       if (index != -1) {
          targetId = divs[i].parentNode.id;
          document.getElementById(targetId).scrollIntoView();
          document.getElementById(targetId).style.backgroundColor = 'orange';
          break;
       }
    }  
 }

