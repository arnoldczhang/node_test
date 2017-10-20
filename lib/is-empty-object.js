
module.export = (object) => {
  if (!object || typeof object !== 'object' || Array.isArray(object)) return false;
  return !Object.keys(object).length;
};
