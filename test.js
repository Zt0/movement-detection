function solution(inputString) {
    let str = ''
    console.log(recursion(inputString, str))
}

function recursion(inputString){
    if(inputString.indexOf('(') === -1) return inputString.split('').reverse().join('')
    let left = inputString.substring(0, inputString.indexOf('('))
    let right = inputString.substring(inputString.indexOf(')') + 1, inputString.length)
    console.log(left, 3, right)
    let inner = inputString.substring(inputString.indexOf('(') + 1,
        inputString.indexOf(')'))
    return `"${left}${recursion(inner)}${right}"`
}

// solution('(bar)')
// solution('foo(bar)baz')
solution('foo(bar)baz(blim)')
