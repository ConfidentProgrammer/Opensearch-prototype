/*
1. document with the paragraphs
2. tokenize its words, separate the words and count the words
3. initialize the hashmap of each unique words
*/
// const documents = [`This is the deep patel`,
//     `bottle is table and table is the bottle`,
//     `Programming is the magic and deeP Patel loves to do it`,
//     `Software is magic as well`
// ]

import inquirer from 'inquirer';
import fs from 'fs'

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

const fuzzySearch = async (searchTerm, invertedIndex, documentsList) => {
    let words = []
    invertedIndex.forEach((value, key) => {
        if(key.includes(searchTerm)){
            words.push(key)
        } 
    })
    const results = await Promise.all(words.map(word => search(word, invertedIndex, documentsList)))
    return results
}

const search = (searchTerm, invertedIndex, documentsList) => {
    return new Promise((resolve) => {
        searchTerm = searchTerm.toLowerCase()
        const results = invertedIndex.get(searchTerm)?.map(index => documentsList[index]) || []
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
    return searchTerms.split(' ').length > 1
}

const isMultiWordsOR = (searchTerms) => {
    return searchTerms.split(' OR ').length > 1
}

const isMultiWordsAND = (searchTerms) => {
    return searchTerms.split(' AND ').length > 1
}

const multiWordsSearchOR = async (searchTerms, preInvertedIndexMap, documentList) => {
    const searchWords = searchTerms.split(' OR ')
    const searchResults = await Promise.all(searchWords.map(word => search(word, preInvertedIndexMap, documentList)))
    return searchResults
}

const multiWordsSearchAND = async (searchTerms, preInvertedIndexMap, documentList) => {
    const searchWords = searchTerms.split(' AND ')

    const searchResults = await Promise.all(searchWords.map(word => search(word, preInvertedIndexMap, documentList)))

    const result = searchResults.reduce((accumulator, currentValue) => accumulator.filter((acc) => currentValue.includes(acc))) 

    return result
}

const operationResult = async (searchTerm, validationF1, validationF2, operationF, errorMessage, preInvertedIndexMap, documentList) => {
    let searchResult = ''
    if(validationF1(searchTerm) && validationF2(searchTerm)){
        searchResult = await operationF(searchTerm, preInvertedIndexMap, documentList)
    }else {
        throw new Error(errorMessage)
    }
    return searchResult
}

//main execution
const mainExecution = async (operation, searchTerm) => {

    console.time('exec time')
    const preInvertedIndexMap = await readInvertedIndexFromFile() 
    const documentList = await readBookAndGetArray('book.txt')
    let searchResult = ''
    switch(operation){
        case 'OR Query': {
            searchResult = await operationResult(searchTerm, isMultiWords, isMultiWordsOR, multiWordsSearchOR, 'OR operation Failed!, Please make sure Input is correct, E.g: Book OR Animal OR Tree', preInvertedIndexMap, documentList)
        }
        break;
        case 'AND Query': {
            searchResult = await operationResult(searchTerm, isMultiWords, isMultiWordsAND, multiWordsSearchAND, 'AND operation Failed!, Please make sure Input is correct, E.g: Book AND Animal AND Tree', preInvertedIndexMap, documentList)
        }
        break;
        case 'Word Search': {
            searchResult = await search(searchTerm, preInvertedIndexMap, documentList)
        }
        break;
        case 'Partial Matching & Fuzzy Search': {
            searchResult = await fuzzySearch(searchTerm, preInvertedIndexMap, documentList)
        }
        }
    console.timeEnd('exec time')
    console.log(searchResult)
}
inquirer
  .prompt([
   {
    message: "Please choose the operation?",
    name: "operation",
    type: "list",
    choices: ['OR Query', 'AND Query', 'Word Search', 'Partial Matching & Fuzzy Search']
   },  
   {
    message: "Enter word(s) to search. Separated by AND or OR or single word",
    name: 'query'
   }
  ])
  .then(async (answers) => {
    const searchTerms = answers['query']
    const operation = answers['operation']
    await mainExecution(operation, searchTerms)
  })
  .catch((error) => {
    console.log(error)
  });