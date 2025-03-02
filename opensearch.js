/*
1. document with the paragraphs
2. tokenize its words, separate the words and count the words
3. initialize the hashmap of each unique words
*/
// const documents = [
//     `This is the deep patel, anchal PAtel is my wife, she is very beautiful`,
//     `bottle is table and table is the bottle`,
//     'Programming is the magic and deeP Patel loves to do it',
//     `Software is magic as well`
// ]
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

const separateUniqueWords = (string) => {
    let res = string.split(' ').map(str => str.toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:,.<>\{\}\[\]\\\/]/gi, ''))
    
    return new Set(res)
}

const preComputeInvertedIndex = (documents) => {
    let preIndex = new Map()
    for(let i = 0 ; i<documents.length ; ++i){
        sentence = documents[i]
        sentenceArr = separateUniqueWords(sentence)
        sentenceArr.forEach((word, index) => {
            if (preIndex.has(word)) {
                let preIndexArr = preIndex.get(word)
                preIndexArr.push(i)
                preIndex.set(word, preIndexArr)
            }else {
                let preIndexArr = [i]
                preIndex.set(word, preIndexArr)
            }
        })
    }
    return preIndex
}

const search = (searchTerm, documentsList) => {
    searchTerm = searchTerm.toLowerCase()
    const preComputedIndex = preComputeInvertedIndex(documentsList)
    const docList =  preComputedIndex.get(searchTerm)
    const res = []
    docList?.forEach((index) => {
        res.push(documentsList[index])
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
