
import './style.css';
import Icon from './1.jpg';
import Data from './data.xml';
import printMe from './print.js';
function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');
    element.classList.add('hello');
    btn.innerHTML = 'Click me and check the console!';
    var myIcon = new Image();
       myIcon.src = 'dist/'+Icon;
    btn.onclick = printMe;
    //element.appendChild(myIcon);
    element.appendChild(btn);
    console.log(Data);
    return element;
  }
  
  document.body.appendChild(component());

   if (module.hot) {
      module.hot.accept('./print.js', function() {
        console.log('Accepting the updated printMe module!');
        printMe();
      })
    }