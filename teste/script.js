function  somme(a)
{ 
    let somme= 0
    for (let A =0 ; A<a.length ; A++)
        somme+= a[A]


    return somme
}
const tab =[1,2,3]
let s=somme(tab)



// le plus grans nombre dans un tableau

function plusgrand(a)
{
    let max = a[0]
    let i=0
    while(i<a.length)
    {
        if(max<a[i])
        {
            max=a[i]
        }
        i++
    }
   return max
}


// un tableau d objet 

function tableauobjet(a)
{
   
    for (let i = 0; i < a.length; i++) {
        let text = " "
        for (const val in a[i]) {
            {
                
               text += a[i][val] + " " 
            }
            
        }
        alert("pour " + i +" on a" + text)
        
    }
}

const t=[{ nom:"mass" , prenom:"diouf" , age: 12},{ nom:"semba" , prenom:"diop" , age: 20},{ nom:"omar" , prenom:"diouf" , age: 52}]



// afficher tous les nombre pairs

function pair()
{
    for (let i = 0; i < 20; i++) {
        if (i%2==0) {
            alert(i)
        }
        
    }
}
 

 // palindrome

 function palindrome(chaine)
 {
    let texte=""
    for (let i = chaine.length-1; -1 <i ; i--) {
        
       texte+=chaine[i] 
    }
    if (chaine==texte) {
        return true
    }
    
    return false
   
 }


 // tester this 

 function saluer()
 {
   const person={ nom :"diouf", age : 13, afficher: function()
    {
        alert(this.nom)
    }}

   person.afficher()
    
 }
 
 saluer()

