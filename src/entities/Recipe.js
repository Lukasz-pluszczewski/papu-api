import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ObjectIdColumn } from 'typeorm';
import Ingredient from './Ingredient';

@Entity()
export default class Recipe {
  constructor(title, recipe, ingredients) {
    this.title = title;
    this.recipe = recipe;
    this.ingredients = ingredients;
  }

  @ObjectIdColumn()
  id = undefined;

  @Column('text')
  title = '';

  @Column('text')
  recipe = '';

  @Column('array', type => Ingredient)
  ingredients = [];
}
