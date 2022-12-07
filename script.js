const display = document.querySelector(".calculator-input");
const keys = document.querySelector(".calculator-keys");

let displayValue = '0';
let firstValue = null; // Bir işlem veya sayı girildikten sonra (operatör girilince) bu kısma atar.
let operator = null;
let waitingForSecondValue = false; //İkinci değer için bekleniyor mu adında. Varsayılanı false. Bilgi girişi yapılacağı zaman true olacak..
updateDisplay(); //Sayfa açılınca göstermeye başlayacak..

function updateDisplay(){
    display.value = displayValue; //İnput kısmına global alanda tanımlanan displayValue gelir.
}

//Keysleri ve inputu belirt.  //Tıklananı elemente at.
//Elementlerden biri click olunca çağrılır. Eğer decimal'e basılırsa inputDecimal çağrılır. Ve metoda göre içinde nokta yoksa tıklandığında nokta eklenir.
//Case'lere göre basılma işleminden sonra işlem bitince update ile güncellenir.
//FirstValue başta boş. Boşken sayı girilip operatore basılırsa değeri firstValue'ye aktarır. 
//handleOperator çağırıldığında yani operatöre basıldığında waitingFor true olur ve ikinci değer girilebilir.

keys.addEventListener('click',function(e){
    const element = e.target; //Tıklanılanı elemente atıyor. Target ile. Fakat dış kısmına da tıklayınca div gözükmemesi için aşağıdaki kısım yapılır
    if(!element.matches("button")) return; //Elementin buton olup olmadığını kanıtlar. Buton değilse return ile sonraki kodların çalışmaması demek buradan dön..
    
    switch(element.value){
        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
            handleOperator(element.value);
            break;
        case '.':
            inputDecimal();
            break;
        case 'clear': //Value bilgisi clear olduğu için bu şekilde ulaşabiliriz.
            clear();
            break;
        default:
            inputNumber(element.value); //Element value num'a gider.
    }
    updateDisplay(); //Her butona basıldıktan sonra updateDisplay ile display value gözükecek.
});

function inputNumber(num){ //Dışarıdan number alacak. Dışarıdan element.value değeri eklenecek.
    if(waitingForSecondValue){ //True ise.. Operatöre basıldığında element.value değerini displayValue aktarılır. True iken de yazılabilir.. Daha sonra false'ye çekilir
        displayValue = num; //Ör: 10 vardı. +'ya basıldı ve 20 yazıldı. 20'yi displayValue'de gösterir. (!! +'ya basıldıktan sonra bu kısım çalışır.)
        waitingForSecondValue = false;
    }
    else{ //True değilse display value'ye değer direkt aktarılabilir. DisplayValue başta sıfır ise gelen element.value aktarılır. Değilse olan sayının yanına gelen element.value aktarılır.
        displayValue = displayValue === '0' ?  num : displayValue + num;
    }  
}

function handleOperator(nextOperator){
    const value = parseFloat(displayValue); //displayValue, value değişkenine aktarılacak.
    
    if(operator && waitingForSecondValue){ //handleOperator çağırıldığında true olacağı için ve bir operatör aktarılacağı için ikiside boş veya false olmaz True olur. Ve dışarıdan gelen elementevalue operatöre aktarılır
        operator = nextOperator; 
        return;
    }
    
    if(firstValue == null){ //İlk defa bilgi girilecekse ve girildikten sonra operatöre basılırsa o ilk değeri firstValue değişkenine atar.
        firstValue = value;
    }
    //Alttakinde herhangibir operatore basıldığında  dışarıdan aldığı nextOperatoru yukarıda operator değişkenine atmıştık. calculate fonksiyonunu çağırıp hangi operatör çağırıldıysa ona göre işlem yapılır.
    //calculate fonks sonucu result'a atılır. Ve çevrilerek displayValue'ye aktarılır. Aynı zamanda firstValue olarak atacak. Tekrar işlem yapmak için..
    else if(operator){
        const result = calculate(firstValue, value, operator);
        displayValue = `${parseFloat(result.toFixed(9))}`;
        firstValue = result; // Daha sonra tekrar işlem yapmak için sonucu firstValue'ye atılacak. Hafızada kalması için.
    }
    waitingForSecondValue = true; //İkinci değeri beklediğini belirtecek. Daha sonra inputNumber çalışırsa bu kısım tekrar false olacak. Herhangibir inputnumber'e basıldığında tuşlarda..
    operator = nextOperator; //Daha sonra 
}

function calculate(first,second, operator){ 
    if(operator === '+'){
        return first + second;
    }
    else if(operator === '-'){
        return first-second;
    }
    else if(operator === '*'){
        return first * second;
    }
    else if(operator === '/'){
        return first / second;
    }
    return second; //Value yani displayValue döndürülür. O gözükür. Üstte tekrar operatore basıldığında result displayValue'ye aktarılır ve o gözükür.
}

function inputDecimal(){ //Görevi tıklanınca sonuna nokta eklemesi. (Nokta yoksa)
    if(!displayValue.includes('.')){ 
        displayValue += '.';
    }
}
function clear(){
    displayValue = "0";
}