/*
1. document with the paragraphs
2. tokenize its words, separate the words and count the words
3. initialize the hashmap of each unique words
*/
// const documents = [
//     `This is the deep patel,
//     `bottle is table and table is the bottle`,
//     'Programming is the magic and deeP Patel loves to do it',
//     `Software is magic as well`
// ]
const fs = require('fs');

const readBookAndGetArray = (filePath) => {
    return new Promise((resolve, reject) => {
    //Read the file asynchronously
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            reject(err)
        }else {
            resolve(data.split(/[.!?]/))
        }
    });
    })
}

const separateUniqueWords = (string) => {
    let res = string.split(' ').map(str => str.toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:,.<>\{\}\[\]\\\/]/gi, ''))
    
    return new Set(res)
}

// This function is only ran once, just to create invertedIndex and store in to the file
const preComputeInvertedIndex = (documents) => {
    let preIndex = new Map()
    for(let i = 0 ; i<documents.length ; ++i){
        sentence = documents[i]
        sentenceArr = separateUniqueWords(sentence)
        sentenceArr.forEach((word) => {
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
    writePreIndexToFile(preIndex)
    return preIndex
}

const writePreIndexToFile = (PreInvertedIndex) => {
    //convert to json
    const json = JSON.stringify(Object.fromEntries(PreInvertedIndex));
    fs.writeFile('preIndex.json', json, 'utf8', (err, res) => {
        if(err){
            console.log('something went wrong!!')
            return
        }else {
            console.log('preIndex written to file!')
        }
    });
}

const search = (searchTerm, invertedIndex) => {
    return new Promise((resolve) => {
        searchTerm = searchTerm.toLowerCase()
        const results = invertedIndex.get(searchTerm) || []
        resolve(results.length ? results : 'Not found!')
    })
}

const readInvertedIndexFromFile = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('preIndex.json', 'utf8', (err, data) => {
            if (err) {
                reject(err)
            }else {
                const parsedJson = JSON.parse(data)
                const PreInvertedIndexMap = new Map(Object.entries(parsedJson))
                resolve(PreInvertedIndexMap)
            }
        });
    })
}

const isMultiWords = (searchTerms) => {
    const arr = searchTerms.split(' ')
    return arr.length>1
}

const multiWordsSearchOR = async (searchTerms, preInvertedIndexMap) => {
    const searchWords = searchTerms.split(' & ')
    const searchResults = await Promise.all(searchWords.map(word => search(word, preInvertedIndexMap)))
    return searchResults
}

//main execution
(async ()=> {
    const searchTerm =  `apple & book & cat & dog & elephant & flower & guitar & house & icecream & jungle & kite & lamp & mountain & notebook & ocean & piano & queen & river & sun & tree` // multi word search OR query
    //const searchTerm = process.argv[2]
    console.time('exec time')
    const preInvertedIndexMap = await readInvertedIndexFromFile() 

    const searchResult = isMultiWords(searchTerm) ? await multiWordsSearchOR(searchTerm, preInvertedIndexMap) : await search(searchTerm, preInvertedIndexMap)
    console.timeEnd('exec time')
    console.log(searchResult)

})()