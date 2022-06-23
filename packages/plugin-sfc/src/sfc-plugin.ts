import type { MarkdownItEnv } from '@mdit-vue/shared';
import type { PluginWithOptions } from 'markdown-it';
import type { SfcPluginOptions } from './types';

/**
 * Avoid rendering vue SFC script / style / custom blocks
 *
 * Extract them into env
 */
export const sfcPlugin: PluginWithOptions<SfcPluginOptions> = (
  md,
  { customBlocks = [] }: SfcPluginOptions = {},
): void => {
  // extract `<script>`, `<style>` and other user defined custom blocks
  const sfcBlocks = Array.from(new Set(['script', 'style', ...customBlocks]));
  const sfcBlocksRegexp = new RegExp(
    `^<(${sfcBlocks.join('|')})(?=(\\s|>|$))`,
    'i',
  );

  const rawRule = md.renderer.rules.html_block!;
  md.renderer.rules.html_block = (
    tokens,
    idx,
    options,
    env: MarkdownItEnv,
    self,
  ) => {
    const content = tokens[idx].content;
    const extractedSfcBlocks = env.sfcBlocks || (env.sfcBlocks = []);

    // extract sfc blocks to env and do not render them
    if (sfcBlocksRegexp.test(content.trim())) {
      extractedSfcBlocks.push(content);
      return '';
    }

    return rawRule(tokens, idx, options, env, self);
  };
};
