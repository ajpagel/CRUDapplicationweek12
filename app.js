//add code that we want the app to do
//class for Recipe
//class for ingredients
//class for recipe service that enables us to send http request to preexisting api
//class for DOM... clear out the page




class Recipe {
    constructor(name) {
        this.name;
        this.ingredients = [];
    }


    //method for adding ingredients

    addIngredient(name, amount){
        this.ingredients.push(new Ingredient(name, amount));
    }
}


class Ingredient {
    constructor(name, amount) {
        this.name = name;
        this.amount= amount;
    }
}


class RecipeBook { //this willsend HTTP request
    static url = "https://crudcrud.com/apif817655fb1824a9ca5f5449f8be2791c";

    //create methods and return so we can use these methods and the promise that comes back


    //FIRST METHOD: get all recipes
    //SECOND METHOD: get one recipe
    //THIRD METHD: CREATE RECIPE
    //4th: UPDATE RECIPE
    //5th: DELETE RECIPE

    static getAllRecipes() {
        return $.get(this.url); //use jquery to get all recipes
    }

    static getRecipe(id) {
        return $.get(this.url + `${id}`);
    }

    static createRecipe(recipe) {
        return $.post(this.url, recipe); //post recipe to api
    }

    static updateRecipe(recipe) {
        return $.ajax({
            url: this.url + `/${recipe._id}`,
            dataType: 'json',
            data: JSON.stringify(recipe),
            contentType: 'application/json',
            type: 'PUT'
        });
    }


    static deleteRecipe(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}




//then use recipebook class in DOM manager class
//rerender the dom when we create a new class
class DOMManager {
    static recipes; // this is variable to represent all recipes in this class

    static getAllRecipes() { //this calls the method in Recipe class and rerenders DOM
        RecipeBook.getAllRecipes().then(recipes => this.render(recipes)); //returns promise so use.then
    }

    static deleteRecipe(id) {
        RecipeBook.deleteRecipe(id)
        .then(() => {
            return RecipeBook.deleteRecipe(); //send http request. delete recipe, get all recipes again and render those recipes again

        })
        .then((recipes) => this.render(recipes)); //re-render
    }

    static createRecipe(name) {
        RecipeBook.createRecipe(new Recipe(name))
        .then(() => {
            return RecipeBook.getAllRecipes();
        })
        .then((recipes) => this.render(recipes));
    }
    //add ingredient
    static addIngredient(id) {
        for(let recipe of this.recipes){
            if(recipe._id == id) {
                recipe.ingredients.push(new Ingredient($(`#${recipe._id}-ingredient-name`).val(), $(`#${recipe._id}-ingredient-amount`).val())); 
                RecipeBook.updateRecipe(recipe)
                //send updated request to API to save new data
                .then(()=> {
                    return RecipeBook.getAllRecipes();
                })
                .then((recipes) => this.render(recipes));
            
            }
        }
    }



    //delete ingredient

    static deleteIngredient(recipeId, ingredientId) {
        for(let recipe of this.recipes) {
            if(recipe._id == recipeId) {
                for(let ingredient of recipe.ingredients){
                    if(ingredient._id == ingredientId) {
                        recipe.ingredients.splice(recipe.ingredients.indexOf(ingredient), 1);
                        RecipeBook.updateRecipe(recipe)
                        .then(()=> {
                            return RecipeBook.getAllRecipes();

                        })
                        .then((recipes) => this.render(recipes));
                    }
                }
            }
        }
    }

//BUILD RENDER METHOD

    static render(recipes) {
        this.recipes = recipes; //recipes is the variable for all recipes inthis DOMMAnAGER
        $('#app').empty(); //thiswillgrab a reference to the div in HTML and render these 
        //now for loop to rerender the recipes
        for(let recipe of recipes) {
            //add the html in js with prepend and backticks
            $('#app').prepend(
            `<div id="${recipe._id}" class="card">
                <div class="card-header">
                    <h2>${recipe.name}</h2> 
                    <button class="btn btn-danger" onclick="DOMManager.deleteRecipe('${recipe._id}')">Delete></button>
                </div>
                <div class="card-body">
                    <div class="card">
                        <div class="row">
                            <div class="col-sm">
                                <input type="text" id="${recipe._id})-ingredient-name" class="form-control" placeholder="Ingredient Name">

                            </div>
                            <div class="col-sm">
                                <input type="text" id="${recipe._id})-ingredient-amount" class="form-control" placeholder="Ingredient Amount">
                            </div>
                        </div>
                        <button id="${recipe._id}-new-ingredient" onclick="DOMManager.addRoom('${recipe._id}')" class="btn btn-primary form-control">Add</button>
                    </div>
                </div>
            </div><br>`
        );
            //nested for loop to render each ingredient inside the recipe
        


            for(let ingredient of recipe.ingredients){
                $(`#${recipe._id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${ingredient._id}"><strong>Name: </strong> ${ingredient.name}</span>
                        <span id="amount-${ingredient._id}><strong>Amount: </strong> ${ingredient.amount}</span>
                        <button class="btn btn-danger" onclick="DOMManager.deleteRecipe('${recipe._id}', '${ingredient._id}')">Delete Ingredient</button>

                    `

                )
                
            }
        }
    }
}








$('#create-new-recipe').click(() => {
    DOMManager.createRecipe($('#new-recipe-name').val());
    $('#new-recipe-name').val(' ');
})

//add buttons delete recipe, add ingredient, delete ingredient; add above the render of recipes



//TEST

DOMManager.getAllRecipes();