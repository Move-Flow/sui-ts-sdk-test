
const webConfig = "APTOS";

interface Result {
    amount: number;
  }

const withdraw_apt = (amount: number/*, department: string*/): Result => {
    console.log("webConfig in fn", webConfig);
    console.log("input in fn", amount);
    return {amount: amount * 2};
};

function webPortal<F extends (arg: any) => any>(action: string, f: F, arg: Parameters<F>): ReturnType<F> {
    switch (action) {
        case "withdraw":
            console.log("webConfig", webConfig);
            return withdraw_apt(arg);
    }

    // return f(arg);
  }

console.log("multi-backend file");
const result = webPortal("withdraw", [2]);
console.log("result", result);