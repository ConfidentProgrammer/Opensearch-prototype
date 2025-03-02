/*
1. document with the paragraphs
2. tokenize its words, separate the words and count the words
3. initialize the hashmap of each unique words
*/
const fs = require('fs')
const readBookAndGetArray = (filePath, callback) => {
    //Read the file asynchronously
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            callback(err, null)
            return;
        }
        //divide data to array at every thousand characters
        callback(null, data.split(/[.!?]/))
    });
}

const separateUniqueWords = (str, documentNumber) => {
    let res = new Map()
    let temp = ''
    for(let i = 0 ; i<str.length ; ++i) {
        temp+=str.charAt(i)
        if(str.charAt(i) === ' ' || i === str.length-1){
            temp = temp.trim()
            temp = temp.replace(/[`~!@#$%^&*()_|+\-=?;:,.<>\{\}\[\]\\\/]/gi, '');
            temp = temp.toLowerCase()
            if(!res.has(temp)){
                res.set(temp, documentNumber)
            }
            temp = ''
        }
    }
    return res;
}

const preComputeInvertedIndex = (documents) => {
    let preIndex = new Map()
    for(let i = 0 ; i<documents.length ; ++i){
        sentence = documents[i]
        sentenceMap = separateUniqueWords(sentence, i)
        sentenceMap.forEach((value, key) => {
            if(preIndex.has(key)){
                let preIndexArr = preIndex.get(key)
                preIndexArr.push(value)
                preIndex.set(key, preIndexArr)
            }else {
                let docArr = [value]
                preIndex.set(key, docArr)
            }
        });
    }
    return preIndex
}


const search = (searchTerm, documentsList) => {
    searchTerm = searchTerm.toLowerCase()
    const preComputedIndex = preComputeInvertedIndex(documentsList)
    const docList =  preComputedIndex.get(searchTerm)
    const res = []
    docList?.forEach((index) => {
        res.push(index)
    })

    return res
}

//read file
readBookAndGetArray('book.txt', (err, res)=> {
    if(err){
        console.log('This is the error', err)
    }else {
        console.time('Time')
        const searchResult = search(process.argv[2], res)
        console.timeEnd('Time')
        console.log(searchResult)
    }
})