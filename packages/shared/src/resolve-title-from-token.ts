import type Token from 'markdown-it/lib/token.mjs';
import { htmlEscape } from './html-escape.js';

interface TokenMeta {
  /**
   * Generated by markdown-it-anchor
   *
   * @see https://github.com/valeriangalliat/markdown-it-anchor/blob/8918e4eba26df9b13819acde5a9bf4e4fb8d9816/permalink.js#L10-L12
   */
  isPermalinkSymbol?: boolean;
}

export interface ResolveTitleOptions {
  /**
   * Should allow inline HTML tags or not.
   *
   * If the result is going to be used as Vue template, it should allow inline
   * HTML tags so that Vue custom components would be kept.
   */
  shouldAllowHtml: boolean;

  /**
   * Should escape the text content or not.
   *
   * If the result is going to be used in HTML directly, it should be escaped
   * so that the text content won't be wrongly treated as HTML tags.
   */
  shouldEscapeText: boolean;
}

/**
 * Resolve header title from markdown-it token
 *
 * Typically using the next token of `heading_open` token
 */
export const resolveTitleFromToken = (
  token: Token,
  { shouldAllowHtml, shouldEscapeText }: ResolveTitleOptions,
): string => {
  // children of the token contains the parsed result of the heading title
  const children = token.children ?? [];

  // type of tokens to be included in the heading title
  const titleTokenTypes = ['text', 'emoji', 'code_inline'];

  // include 'html_inline' or not
  if (shouldAllowHtml) {
    titleTokenTypes.push('html_inline');
  }

  // filter the token type to be included in the title
  const titleTokens = children.filter(
    (item) =>
      titleTokenTypes.includes(item.type) &&
      // filter permalink symbol that generated by markdown-it-anchor
      !(item.meta as TokenMeta | undefined)?.isPermalinkSymbol,
  );

  // get title from tokens
  return titleTokens
    .reduce((result, item) => {
      if (shouldEscapeText) {
        // escape the content of 'code_inline' and 'text'
        if (item.type === 'code_inline' || item.type === 'text') {
          return `${result}${htmlEscape(item.content)}`;
        }
      }

      // keep the content of 'emoji' and 'html_inline'
      return `${result}${item.content}`;
    }, '')
    .trim();
};
