const identifierPattern = /[a-zA-Z_]\w*\b/
const constantPattern = /[0-9]+\b/
const intKeyword = /int\b/
const voidKeyword = /void\b/
const returnKeyword = /return\b/
const newlineKeyword = /\n/
const whiteSpaceKeyword = /\s/



function lexer(rawInput) {
    const tokens = []

    while (input.length > 0) {
        if (input.startsWith(' ') {
	    input = input.trimStart()
	} else {
	    const match = input.match(/*Should add reg here*/)
	    if (!match) {
                throw new Error("Failed to tokenize")
	    }

	    tokens.push(match[0]) 
	    input = input.slice(match[0].length)
	} 
    }

    return tokens
}
