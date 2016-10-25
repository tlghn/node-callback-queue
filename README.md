# node-callback-queue
Callback queue

## Usage

```
    const queue = require('node-callback-queue');
    
    function onComplete(err, result){
        if(err) {
            return console.log('Error: %s', err);
        }
        console.log('Result %s', result);
    }
    
    queue
    (
        // complete callback
        onComplete,
        
        // initial callback
        function(next) {
            next(null, 'param 1', 'param 2');
        },
        
        // queued callback
        function(arg1, arg2, next){
            console.log("args %s, %s", arg1, arg2);
            // output:
            // args param 1, param 2
            next(null, arg1, arg2, true, 123);
        },
        
        // queued callback
        function(arg1, arg2, arg3, arg4, next) {
            console.log("args %s, %s, %s, %s", arg1, arg2, arg3, arg4);
            // output:
            // args param 1, param 2, true, 123
            next(null, "another arg");
        },
        
        // queued callback
        function(arg1, next){
            console.log("args %s", arg1);
            // output:
            // args another arg
            
            if(arg1 === "another arg") {
                // lets stop execution
                return next(new Error("Failed"));
            }
            
            // put args as many as next callback requires
            next(null, 1, 2, 3, 4, 5);
        },
        
        // this callback and next callbacks will be ignored
        // because previous callback send an error as first parameter
        // to "next"
        function(arg1, arg2, arg3, arg4, arg5, next){
            // if this method was executed
            // this would be final call of current queue with the result
            var result = "result";
            next(null, result);
        }
    );
```
