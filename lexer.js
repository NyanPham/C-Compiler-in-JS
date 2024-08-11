const tokenPatterns = [
    { regex: /[0-9]+\b/, type: 'CONSTANT' },
    { regex: /[a-zA-Z_]\w*\b/, type: 'IDENTIFIER' },
    { regex: /int\b/, type: 'INT_KEYWORD' },
    { regex: /void\b/, type: 'VOID_KEYWORD' },
    { regex: /return\b/, type: 'RETURN_KEYWORD' },
]

const reg = tokenPatterns
	.map(pattern => pattern.regex.source)
        .join('|')
const regExp = new RegExp(reg, 'g')

const getTokenType = (tokenValue) => {
    const currPattern = tokenPatterns.find(pattern => pattern.regex.test(tokenValue))
    if (currPattern == null) throw new Error("Unknown token type")
    
    return currPattern.type
}

const lexer = (input) => {
    const tokens = []

    while (input.length > 0) {
        if (input.startsWith(' ')) {
	    input = input.trimStart()
	} else {
	    const match = input.match(regExp)
	    if (!match) {
                throw new Error("Failed to tokenize")
	    }

	    tokens.push({ value: match[0], type: getTokenType(match[0])  }) 
	    input = input.slice(match[0].length)
	} 
    }

    return tokens
}
