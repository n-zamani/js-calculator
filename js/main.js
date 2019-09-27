//Niloofar Zamani

"use strict";

$(document).ready(function(){
    
    let operators = ['+','-','*','×','/','÷'];
    let error = false;
    let lastKey = [];
    let gotHistory = false;

    function clearEntry() { //function for CE button
        if (error) { //if the result of equations was an error
            $(".equation").text(''); //equation will be empty
            $(".entry").text('0'); //entry will have a 0 in it
            error = false;
        } else {
            let currentEntry = $(".entry").text();
            let currentEq = $(".equation").text();
            $(".entry").text('0'); //entry will have a 0 in it

            //if the last character of equation was an operator, equation won't change, else the last number that has currentEntry's length will be removed
            operators.includes(currentEq[currentEq.length-1]) ? $(".equation").text(currentEq) :
            $(".equation").text(currentEq.slice(0,currentEq.length - currentEntry.length));
        }
    }

    function clear() { //function for C button
        $(".equation").text(''); //equation will be empty
        $(".entry").text('0'); //entry will have a 0 in it
        error = false; //in case error was true
    }

    function backspace() { //function for backspace button
        if (error) { //if the result of equations was an error
            $(".equation").text(''); //equation will be empty
            $(".entry").text('0'); //entry will have a 0 in it
            error = false;
        } else if (lastKey[lastKey.length-1] == '=') { //if = was the last enterd key, it won't change the content of entry
            return $(".entry").text();
        } else {
            let currentEntry = $(".entry").text();
            let currentEq = $(".equation").text();
            if(operators.includes(currentEq[currentEq.length-1])) { //if last character of equation was an operator, it won't change anything
                return;
            } else if (currentEntry.length == 1) { //if length of entry is 1, its content will be 0
                $(".entry").text('0');

                //if length of equation is 1, it will become empty. else if entry was a number other than 0, equation will remove its last character
                currentEq.length == 1 ? $(".equation").text('') :
                currentEntry != 0 ? $(".equation").text(currentEq.slice(0,-1)) : $(".equation").text();
            } else { //last character of both equation and entry will be removed
                $(".equation").text(currentEq.slice(0,-1));
                $(".entry").text(currentEntry.slice(0,-1));
            }
        }
    }

    function trash() { //function for clearing history
        $(".history-content").html("<div></div>");
    }

    function calculate(str) { //function for = button

        //if the last character of str is an operator, the content of entry will be added to str
        operators.includes(str[str.length-1]) ? str += $(".entry").text() : str;

        //if there's -- in str, -- will be replaces by +
        str.includes('--') ? str = str.split('--').join('+') : str;

        //if str is empty, it gets the value of entry (newly added)
        str == '' ? str = $(".entry").text() : str;
        
        let result = eval(str); //evaluates str

        if (result == 'Infinity' || isNaN(result)) { //if the result is Infinity or NaN, Error will be printed
            $(".entry").text('Error');
            error = true;
        } else {
            $(".equation").text(''); //equation will be empty
            $(".entry").text(`${result}`); //result will be in entry

            //the equation and result will be added to history-content
            $(".history-content>div:first").before(`<div>${str.replace(/\//g, ' ÷ ').replace(/\*/g,' × ').replace(/\+/g, ' + ').replace(/\-/g, ' - ')} = <br>${result}</div><br>`);
        }
    }

    function write(e) { //function for writing in entry and equation sections

        //if e is an operator and gotHistory is false, and last key entered before e was = or equation was empty, equation's content will be entry's
        if (operators.includes(e) && (lastKey[lastKey.length-2] == '=' || $(".equation").text() == '') && !gotHistory) {
            $(".equation").text($(".entry").text());
        }

        let enText = $(".entry").text();
        let eqText = $(".equation").text();

        if (gotHistory && !operators.includes(e)) { //if we get an equation from history and e is not an operator

            //lastOp will find the place of last operator
            let lastOp = Math.max(eqText.lastIndexOf('+'),eqText.lastIndexOf('-'),eqText.lastIndexOf('÷'),eqText.lastIndexOf('×'));

            $(".equation").text(`${eqText.slice(0,lastOp+1) + e}`); //last number of equation will be removed and e will be replaced
            $(".entry").text(e);
            gotHistory = false;
            return; //we don't want rest of the code runs
        }

        $(".entry").text(function(i, origText) {
            if (!isNaN(e)) { //if e is number

                //if entry is 0 or equation's last character is an operator or last key entered before e is =, origText will be empty
                (origText == '0' || operators.includes(eqText[eqText.length-1]) || lastKey[lastKey.length-2] == '=') ? origText = '' : origText;

                return origText + e;
            } else if (e == '.' && (origText == '0' || operators.includes(eqText[eqText.length-1]) || lastKey[lastKey.length-2] == '=')) {
                //if e is . and if entry is 0 or equation's last character is an operator or last key entered before e is =

                $(".equation").text(eqText+'0.'); //0. will be added to the end of equation
                return '0.';
            } else if (e == '.' && !origText.includes('.')) { //this part prevents us from entering multiple dots(.)
                return origText + e;
            }
        });

        $(".equation").text(function(i, origText) {

            e == '/' ? e = '÷' : //if e is / then ÷ will be written
            e == '*' ? e = '×' : //if e is * then × will be written
            e == '.' && $(".equation").text() == '' ? e = '0.' : e; //if e is . and equation is empty, 0. will be written

            //if e is an operator and the last character of equation is an operator, e won't be written
            //if e is '.', and entry has . or last character of equation is '.', e won't be written
            //if e is 0, and equation is empty or its last character is an operator, e won't be written
            if ((operators.includes(e) && operators.includes(origText[origText.length-1])) ||
                (e == '.' && (enText.includes('.') || origText[origText.length-1] == '.')) ||
                (e == '0' && (origText == '' || operators.includes(origText[origText.length-1])))) {
                return;
            }
            return origText + e;
        });
    }

    function negate(str) { //function for ± button
        if (!error) { //when there's no error
            if (str == '0') { //if str is 0, do nothing
                return;
            }
            str[0] != '-' ? str = '-' + str : str = str.slice(1); //if first character is not '-', a '-' will be added to str, else fisrt character will be removed
            $(".entry").text(str); //the new str will replace the old one

            let eqText = $(".equation").text();
            if (operators.includes(eqText[eqText.length-1])) { //if the last character of equation is an operator, str will be added to the end of equation
                $(".equation").text(eqText + str);
            } else {
                //if first character of str is '-', equation's text will remove the last number and str will be added to equation, else str will be added to equation in another way
                str[0] == '-' ? $(".equation").text(eqText.slice(0,eqText.length - str.length + 1) + str) :
                $(".equation").text(eqText.slice(0,eqText.length - str.length - 1) + str);
            }
        } else { //when there's an error, do nothing
            return;
        }
        
    }

    function getHistory(h) { //function for when we want one of equations from history
        let splitHistory = h.split(' ').join('').split('='); //first we remove spaces then we separate equation and result
        $(".equation").text(`${splitHistory[0]}`); //first argument will be in equation
        $(".entry").text(`${splitHistory[1]}`); //second argument will be in entry
    }

    $("body").keyup(function(event) {
        switch (event.key) { //event.key detects which key is entered
            case 'Escape':
                clear();
                break;
            case 'Backspace':
                backspace();
                break;
            case 'Delete':
                clearEntry();
                break;
            case '=':
            case 'Enter':
                lastKey = ['='];
                calculate($(".equation").text().replace(/÷/g, '/').replace(/×/g,'*'));
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '+':
            case '-':
            case '*':
            case '/':
            case '.':
                lastKey.push(event.key);
                write(event.key);
                break;
            case 'F9':
                lastKey.push('±');
                negate($(".entry").text());
                break;
        }
    });

    $("button").click(function() {
        let btn = $(this).text();
        switch (btn) {
            case 'C':
                clear();
                break;
            case 'CE':
                clearEntry();
                break;
            case '=':
                lastKey = ['='];
                calculate($(".equation").text().replace(/÷/g, '/').replace(/×/g,'*'));
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '+':
            case '-':
            case '×':
            case '÷':
            case '.':
                lastKey.push(btn);
                write(btn);
                break;
            case '±':
                lastKey.push('±');
                negate($(".entry").text());
                break;
            default:
                backspace();
        }
    });

    $(".fa-trash-alt").click(trash);

    $("body").on("keydown keyup", function(event) {

        switch(event.key) { //with toggleClass a class will be added and will be removed
            case 'Escape':
                $(".c").toggleClass("grey-press");
                break;
            case 'Backspace':
                $(".backspace").toggleClass("grey-press");
                break;
            case 'Delete':
                $("button:contains('CE')").toggleClass("grey-press");
                break;
            case '0':
                $("button:contains('0')").toggleClass("grey-press");
                break;
            case '1':
                $("button:contains('1')").toggleClass("grey-press");
                break;
            case '2':
                $("button:contains('2')").toggleClass("grey-press");
                break;
            case '3':
                $("button:contains('3')").toggleClass("grey-press");
                break;
            case '4':
                $("button:contains('4')").toggleClass("grey-press");
                break;
            case '5':
                $("button:contains('5')").toggleClass("grey-press");
                break;
            case '6':
                $("button:contains('6')").toggleClass("grey-press");
                break;
            case '7':
                $("button:contains('7')").toggleClass("grey-press");
                break;
            case '8':
                $("button:contains('8')").toggleClass("grey-press");
                break;
            case '9':
                $("button:contains('9')").toggleClass("grey-press");
                break;
            case 'F9':
                $("button:contains('±')").toggleClass("grey-press");
                break;
            case '.':
                $("button:contains('.')").toggleClass("grey-press");
                break;
            case 'Enter':
            case '=':
                $("button:contains('=')").toggleClass("blue-press");
                break;
            case '+':
                $("button:contains('+')").toggleClass("blue-press");
                break;
            case '-':
                $("button:contains('-')").toggleClass("blue-press");
                break;
            case '*':
                $("button:contains('×')").toggleClass("blue-press");
                break;
            case '/':
                $("button:contains('÷')").toggleClass("blue-press");
                break;
        }
    });

    $(".history-content").on("click", "div", function() {
        let history = $(this).text();
        gotHistory = true;
        getHistory(history);
    });

});