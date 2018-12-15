import { Entity, ManyToMany, Column, PrimaryGeneratedColumn, ObjectIdColumn } from 'typeorm';
import Recipe from './Recipe';

@Entity()
export default class Ingredient {
  constructor(name) {
    this.name = name;
  }

  @ObjectIdColumn()
  id = undefined;

  @Column('text')
  name = '';



}
