/* DONT CHANGE THIS CODE - START */
function wait(ms = 1000) { return new Promise(resolve => setTimeout(resolve, ms)) }

class Dish {
    constructor(cookingTime) {
        this.cookingTime = cookingTime;
    }

    async cook() {
        const actualCookingTime = this.cookingTime * (1 + Math.random()) * 100;
        await wait(actualCookingTime);
        return this;
    }
}
/* DONT CHANGE THIS CODE - END */

/*
    YOUR CODE HERE - START
*/

class Bolognese extends Dish {
    constructor() {
        super(10);
        this.ingridientsList = ['spaghetti', 'tomato', 'meat'];
    }
}

class MashedPotatoes extends Dish {
    constructor() {
        super(8);
        this.ingridientsList = ['potato'];
    }
}

class Steak extends Dish {
    constructor() {
        super(7);
        this.ingridientsList = ['meat'];
    }
}

class SteakAndFries extends Dish {
    constructor() {
        super(9);
        this.ingridientsList = ['meat', 'potato'];
    }
}

class Ingridient {
    constructor(name, quantity) {
        this.name = name;
        this.quantity = quantity;
    }
    
}

class Kitchen {
    constructor() {
        this.products = {};
        this.orders = {};
    }

    addToFridge(newProducts) {
        for (let product of newProducts) {
            this.products[product.name] = product.quantity;
        }
    }

    order(dish) {
        for (let ingridient of dish.ingridientsList) {
            if (!(ingridient in this.products)) {
                throw new Error('Not enough ingridients in fridge');
            }
        }

        for (let ingridient of dish.ingridientsList) {
            if (this.products[ingridient] === 1) {
                delete this.products[ingridient];
            } else {
                this.products[ingridient] -= 1;
            }
        }

        if (dish.constructor.name in this.orders) {
            this.orders[dish.constructor.name].count += 1;
        } else {
            this.orders[dish.constructor.name] = {count: 1, dishObject: dish};
        }
    }

    async cookFastestOrder() {
        let fastestTime = Infinity;
        let fastestDish = undefined;

        for (let order in this.orders) {
            if (this.orders[order].dishObject.cookingTime < fastestTime) {
                fastestTime = this.orders[order].dishObject.cookingTime;
                fastestDish = order;
            }
        }

        await this.orders[fastestDish].dishObject.cook();
        console.log(`${fastestDish} was cooked`);

        if (this.orders[fastestDish].count == 1) {
            delete this.orders[fastestDish];
        } else {
            this.orders[fastestDish].count -= 1;
        }

    }

    async cookAllOrders() {
        for (let order in this.orders) {

            for (let i = this.orders[order].count; i > 0; i--) {
                await this.orders[order].dishObject.cook();
                console.log(`${order} was cooked`);
            }

            delete this.orders[order];
        }
    }
}

/*
    YOUR CODE HERE - END
*/

async function test() {
    const kitchen = new Kitchen();
    kitchen.addToFridge([
        new Ingridient('potato', 1),
        new Ingridient('spaghetti', 1),
        new Ingridient('meat', 3),
        new Ingridient('tomato', 2)
    ])


    kitchen.order(new Bolognese()); // Bolognese extends Dish (cookingTime = 10)
    kitchen.order(new MashedPotatoes()); // MashedPotatoes extends Dish (cookingTime = 8)
    kitchen.order(new Steak()); // Steak extends Dish (cookingTime = 7)


    // // Feel free to experiment with various dishes and ingridients

    await kitchen.cookFastestOrder(); // Returns fastest dish to make
    await kitchen.cookAllOrders(); // Returns two dishes in array

    kitchen.order(new SteakAndFries()); // Throws Error: Not enough ingridients in fridge
}

test();
