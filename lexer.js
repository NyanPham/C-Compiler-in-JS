const tokenPatterns = [
    { regex: /[0-9]+\b/, type: 'CONSTANT' },
    { regex: /[a-zA-Z_]\w*\b/, type: 'IDENTIFIER' },
    { regex: /int\b/, type: 'INT_KEYWORD' },
    { regex: /void\b/, type: 'VOID_KEYWORD' },
    { regex: /return\b/, type: 'RETURN_KEYWORD' },
    { regex: /\(/, type: 'OPEN_PARENTHESIS' },
    { regex: /\)/, type: 'CLOSE_PARENTHESIS' },
    { regex: /{/, type: 'OPEN_BRACE' },
    { regex: /}/, type: 'CLOSE_BRACE' },
    { regex: /;/, type: 'SEMICOLON' },
]

const keywordTokens = new Set([...tokenPatterns
    .filter(pattern => pattern.type.endsWith('_KEYWORD'))
    .map(pattern => pattern.regex.source.replace(/\\b/g, ''))])

const reg = tokenPatterns
	.map(pattern => pattern.regex.source)
        .join('|')
const regExp = new RegExp(reg, 'g')

const isKeyword = (tokenValue) => {
    return keywordTokens.has(tokenValue)
}

const getTokenType = (tokenValue) => {
    if (isKeyword(tokenValue)) {
        return tokenValue.toUpperCase() + '_KEYWORD'
    }
    
    const currPattern = tokenPatterns.find(pattern => pattern.regex.test(tokenValue))
    if (currPattern == null) throw new Error("Unknown token type")
    
    return currPattern.type
}

const tokenize = (input) => {
    const tokens = []

    while (input.length > 0) {
        if (input.startsWith(' ') || input.startsWith('\n')) {
            input = input.trimStart()
        } else {
            const match = input.match(regExp)

            if (!match) {
                throw new Error("Failed to tokenize")
            }   

            tokens.push({ value: match[0], type: getTokenType(match[0])  }) 
            input = input.slice(match[0].length)
            input = input.trimStart()
        } 
    }
    
    return tokens
}

module.exports = tokenize
