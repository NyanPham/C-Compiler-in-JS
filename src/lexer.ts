import { TokenType, Token, ValidateTokenErrors } from "./types"
import isAllLowerCase from "./util/isAllLowercase"

const tokenPatterns = [
  { regex: /\b[0-9]+\b/, type: TokenType.Constant },
  { regex: /\b[a-zA-Z_]\w*\b/, type: TokenType.Identifier },
  { regex: /\bint\b/, type: TokenType.IntKeyword },
  { regex: /\bvoid\b/, type: TokenType.VoidKeyword },
  { regex: /\breturn\b/, type: TokenType.ReturnKeyword },
  { regex: /\(/, type: TokenType.OpenParenthesis },
  { regex: /\)/, type: TokenType.CloseParenthesis },
  { regex: /\{/, type: TokenType.OpenBrace },
  { regex: /\}/, type: TokenType.CloseBrace },
  { regex: /;/, type: TokenType.Semicolon },
]

const keywordTokens = [
    TokenType.ReturnKeyword, TokenType.IntKeyword, TokenType.VoidKeyword
]

const isKeyword = (tokenValue : string) : boolean => {
    return keywordTokens.includes((tokenValue.toUpperCase() + "_KEYWORD") as TokenType);
}

const removeComments = (input : string) : string => {
  return input.replace(/\/\/.*/g, "").replace(/\/\*[\s\S]*?\*\//g, "")
}

const getTokenType = (tokenValue: string) : TokenType => {
  if (isKeyword(tokenValue) && isAllLowerCase(tokenValue)) {
    return ((tokenValue.toUpperCase() + "_KEYWORD") as TokenType)
  }

  const currPattern = tokenPatterns.find((pattern) => pattern.regex.test(tokenValue))
  if (currPattern == null) throw new Error(`Unknown token type of ${tokenValue}`)

  return currPattern.type
}

const validateToken = (token: Token): ValidateTokenErrors => {
  if (token.type === TokenType.Identifier || token.type === TokenType.Constant || token.type.endsWith("_KEYWORD")) {
    if (!new RegExp(`\\b${token.value}\\b`).test(token.value)) {
      return ValidateTokenErrors.MustWordBoundary
    }
  }

  return ValidateTokenErrors.NoErrors
}

const tokenize = (input: string): Array<Token> => {
  try {
    const tokens: Array<Token> = []
    input = removeComments(input).trim()

    while (input.length > 0) {
      if (input.startsWith(" ") || input.startsWith("\n")) {
        input = input.trimStart()
      } else {

        const match = tokenPatterns
          .map((pattern) => {
            return input.match(pattern.regex)
          })
          .filter((match) => {
            return match?.index === 0
          })
          .reduce(
            (longest, curr) => {
              if (!longest) return curr; 
              return (curr?.[0].length ?? 0) > longest[0].length ? curr : longest
            },
            [""] 
          ) as RegExpMatchArray

        if (!match || match[0].length === 0) {
          throw new Error(`Failed to tokenize of ${match?.[0]}`)
        }

        const token = {
          value: match[0],
          type: getTokenType(match[0]),
        } as Token

        const validateResult = validateToken(token)
        if (validateResult !== ValidateTokenErrors.NoErrors) {
          if (validateResult === ValidateTokenErrors.MustWordBoundary)
            throw new Error(`Token ${token.value} must end at word boundary`)
        }

        tokens.push(token)
        input = input.slice(match[0].length)
        input = input.trimStart()
      }
    }

    return tokens
  } catch (err) {
    console.log(err)
    return []
  }
}

module.exports = tokenize
