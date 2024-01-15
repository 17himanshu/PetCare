var pets="";
function doselPets()
{
    var lstPets=document.querySelector("#comboPets");
    
    for(var i=0;i<lstPets.length;i++)
    {
        if(lstPets[i].selected)
        {   
            pets=pets+lstPets[i].value+" ";
        }
    }

    document.querySelector("#selPets").value = pets;
}