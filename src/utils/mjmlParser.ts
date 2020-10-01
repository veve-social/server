import mjml from 'mjml';
import { promisify } from 'util';
import fs from 'fs';

import { paths } from '../config/paths';

const readFile = promisify(fs.readFile);

type MjmlParser = (
  templateName: string,
  variables: { [key: string]: string | number }
) => Promise<string>;

export const mjmlParser: MjmlParser = async (templateName, variables) => {
  let template = await readFile(
    `${paths.emails}/${templateName}.mjml`,
    'utf-8'
  );

  Object.keys(variables).forEach((key) => {
    template = template.replace(`{{var:${key}}}`, String(variables[key]));
  });

  const { html } = mjml(template);

  return html;
};
