import { HttpException } from '@nestjs/common';
import mongoose, { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

export abstract class EntityRepository<T extends Document> {
	constructor(protected readonly entityModel: Model<T>) {}

	async findOne(
		entityFilterQuery: FilterQuery<T>,
		projection?: Record<string, unknown>,
	): Promise<T | null> {
		// TODO: add check for _id
		if (
			!entityFilterQuery._id ||
			mongoose.isValidObjectId(entityFilterQuery._id)
		) {
			return await this.entityModel
				.findOne(entityFilterQuery, {
					__v: 0,
					...projection,
				})
				.exec();
		} else if (entityFilterQuery._id) {
			throw new HttpException(
				`the resource with id ${entityFilterQuery._id} does not exisit`,
				404,
			);
		}
	}

	/**
	 *
	 * @param entityFilterQuery FilterQuery<T>
	 * @param populateBy string to populate the find e.g. `.populate(string)`
	 * @returns array of T Objects
	 */
	async find(
		entityFilterQuery: FilterQuery<T>,
		populateBy?: string[],
	): Promise<T[] | null> {
		return await this.entityModel.find(entityFilterQuery).populate(populateBy);
	}

	async create(createEntityData: unknown): Promise<T> {
		const entity = new this.entityModel(createEntityData);
		return entity.save();
	}

	async findOneAndUpdate(
		entityFilterQuery: FilterQuery<T>,
		updateEntityData: UpdateQuery<unknown>,
	): Promise<T | null> {
		return await this.entityModel.findOneAndUpdate(
			entityFilterQuery,
			updateEntityData,
			{
				new: true,
			},
		);
	}

	async deleteMany(entityFilterQuery: FilterQuery<T>): Promise<boolean> {
		const deleteResult = await this.entityModel.deleteMany(entityFilterQuery);
		return deleteResult.deletedCount >= 1;
	}

	async insertMany(createEntityData: unknown[]) {
		return await this.entityModel.insertMany(createEntityData);
	}
}
