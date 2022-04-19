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
        this.ingredients.push(new Recipe(name, amount));
    }
}


class Ingredient {
    constructor(name, amount) {
        this.name = name;
        this.amount= amount;
    }
}


class RecipeBook { //this willsend HTTP request
    static url = "https://crudcrud.com/api/717ccefe42254ba59de32c272d75be1f";

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
        })
    }


    static deleteRecipe(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        })
    }
}




//then use recipebook class in DOM manager class
//rerender the dom when we create a new class
class DOMManager {

}









$('#create-new-recipe').click(() => {
    DOMManager.createRecipe($('#new-recipe-name').val());
    $('#new-recipe-name').val(' ');
})

//add buttons delete recipe, add ingredient, delete ingredient; add above the render of recipes



//TEST

DOMManager.getAllRecipes();