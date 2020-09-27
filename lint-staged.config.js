module.exports = {
  '*.@(ts|tsx)': ['yarn run format:js', 'yarn run lint:js'],
  '*.prisma': ['yarn run format:prisma'],
  '*.json': ['prettier --write'],
};
