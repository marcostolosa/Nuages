// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars

const { NotFound } = require('@feathersjs/errors');

module.exports = (options = {}) => {
  return async context => {
    //console.log("Received IO for pipe " + context.params.route.pipeId);
    if(context.app.pipe_list[context.params.route.pipeId] != undefined){
      var pipe = context.app.pipe_list[context.params.route.pipeId];
      if(pipe.canWrite){
        pipe.out.write(context.arguments[0]);
        if(context.arguments[0].length){
          context.app.service('/implant/io').emit('pipeData', {pipe_id: context.params.route.pipeId, length: context.arguments[0].length});
        }
      }
      if(pipe.canRead){
        if(context.params.route.maxSize){
          var bufferSize = Math.min(pipe.bufferSize, context.params.route.maxSize);
        }else{
          var bufferSize = pipe.bufferSize;
        }
        if(bufferSize == 0){
        }
        else if(pipe.in.readableLength>bufferSize){
          var buff = pipe.in.read(bufferSize);
        }else{
          var buff = pipe.in.read();
        }
        if(buff){
          context.result = buff;
        }else{
          context.result = "";
        }
      }else{
        context.result = "";
      }
      
    }
    else{
      context.statusCode = 404;
      context.data = "";
    }
    return context;
  }
};
