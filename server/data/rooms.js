/**
 * @file data/rooms.js
 * @description CRUD for rooms collection.
 */

import { ObjectId } from "mongodb";
import { rooms } from "../config/mongoCollections.js";
import { idCheck, parameterCheck, strValidCheck } from "../utils/validate.js";
import { getUserByUsername } from "./users.js";

/**
 * @function createRoom
 * @param {string} username
 * @return {object} Returns new Room object
 * @throws {InternalServerError} Throws ISR if MongoDB insertOne() fails 
 * @description This function creates a new Room, adds the user creating the room to the
 * list of participants, and returns the new Room.
 */

export const createRoom = async (username) => {
    parameterCheck(username);
    strValidCheck(username);

    await getUserByUsername(username);

    const newRoom = {
        participants: [username],
        pythonCode: "",
        javaCode: "",
        nodeCode: "",
        cppCode: "",
        rustCode: ""
    }
    const roomCollection = await rooms();
    const insertInfo = await roomCollection.insertOne(newRoom);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw { status: 500, message: 'Internal Server Error' };
    }

    return await getRoom(insertInfo.insertedId.toString());
}

/**
 * @function getRoom
 * @param {string} id
 * @return {object} Returns Room object
 * @throws {NotFound} Throws Not Found room with given ID is not found.
 * @description This function finds a Room with the given ID.
 */

export const getRoom = async (id) => {
    parameterCheck(id);
    strValidCheck(id);
    id = idCheck(id);

    const roomCollection = await rooms();
    const room = await roomCollection.findOne({ _id: new ObjectId(id) });
    if (!room) {
        throw { status: 404, message: `No room with ID: ${id}` };
    }
    return room;
}

/**
 * @function update
 * @param {string} id
 * @param {string} lang
 * @param {string} code
 * @return {object} Returns updated Room object
 * @throws {InternalServerError} Throws ISR if MongoDB updateOne() fails 
 * @description This function updates the room with the given ID
 */

export const updateRoom = async (id, lang, code) => {
    parameterCheck(id, lang);
    strValidCheck(id, lang);
    id = idCheck(id);

    const codeField = `${lang}Code`;

    const updateDoc = {
        $set: {
            [codeField]: code
        }
    };

    const roomCollection = await rooms();
    const room = await roomCollection.updateOne(
        { _id: new ObjectId(id) },
        updateDoc
    );
    if (!room.matchedCount || !room.modifiedCount) {
        throw { status: 500, message: 'Unable to update the room.' };
    }

    return { updated: true };
}

/**
 * @function joinRoom
 * @param {string} id
 * @param {string} username
 * @return {object} Returns Room object with new user in participants list
 * @description This function adds user to room with given ID.
 */

export const joinRoom = async (id, username) => {
    parameterCheck(id, username);
    strValidCheck(id, username);
    id = idCheck(id);
    username = username.trim().toLowerCase();

    const roomCollection = await rooms();
    const room = await roomCollection.findOne({ _id: id });

    await getUserByUsername(username);

    const updatedParticipants = room.participants.push(username);

    const updatedRoom = await roomCollection.findOneAndReplace(
        { _id: new ObjectId(id) },
        updatedParticipants,
        { returnDocument: 'after' }
    );

    return updatedRoom;
}

/**
 * @function deleteRoom
 * @param {string} id
 * @return {object} Returns object indicating Room is deleted
 * @throws {InternalServerError} Throws ISR if MongoDB deleteOne() fails 
 * @description This function deletes room with given ID.
 */

export const deleteRoom = async (id) => {
    parameterCheck(id);
    strValidCheck(id);
    id = idCheck(id);

    const roomCollection = await rooms();
    const deletedRoom = await roomCollection.deleteOne({ _id: new ObjectId(id) });

    if (!deletedRoom.acknowledged || deletedRoom.deletedCount !== 1) {
        throw { status: 500, message: "Internal Server Error" };
    }

    return { deleted: true, id: id };
}
