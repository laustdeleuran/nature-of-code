import Captain from 'captainslog';

const cptn = new Captain('Laust Deleuran');
cptn.toggleDebug(process.env.NODE_ENV === 'development');

export default cptn;
