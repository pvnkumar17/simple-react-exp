export default (state : string = 'HOME', action:{type: string}= {type: 'Home'}) =>
   components[action.type] || state;

const components: {[key: string]:string} = {
  HOME: 'Home',
  USER: 'user',
  LOGIN: 'Login',
  DASHBOARD: 'Dashboard'
};
