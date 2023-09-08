const ContactsRepository = require("../repositories/ContactsRepository");
const isValidUUID = require('../utils/isValidUUID')

class ContactController {
    async index(request, response) {
        // Listar todos os registro

        const { orderBy } = request.query;
        const contacts = await ContactsRepository.findAll(orderBy);
        response.json(contacts);
    }

    async show(request, response) {
        // Obter um registro
        const { id } = request.params;

        if(!isValidUUID(id)) {
            return response.status(400).json({ error: "Invalid user id" });
        }

        const contact = await ContactsRepository.findById(id);

        if (!contact) {
            // 404: Not Found
            return response.status(404).json({ error: "Contact not found" });
        }

        response.json(contact);
    }

    async store(request, response) {
        // Criar novo registro
        const { name, email, phone, category_id } = request.body;

        if (!name) {
            return response.status(400).json({ error: "Must provide a name" });
        }

        if(category_id && !isValidUUID(category_id)) {
            return response.status(400).json({ error: "Invalid category" });
        }

        if(email) {
            const contactExists = await ContactsRepository.findByEmail(email);

            if (contactExists) {
                return response.status(400).json({ error: "E-mail already taken" });
            }
        }

        const contact = await ContactsRepository.create({
            name,
            email: email || null,
            phone,
            category_id: category_id || null,
        });

        response.status(201).json(contact);
    }

    async update(request, response) {
        // Editar registro
        const { id } = request.params;
        const { name, email, phone, category_id } = request.body;

        if(!isValidUUID(id)) {
            return response.status(400).json({ error: "Invalid user id" });
        }

        if(category_id && !isValidUUID(category_id)) {
            return response.status(400).json({ error: "Invalid category" });
        }

        if (!name) {
            return response.status(400).json({ error: "Must provide a name" });
        }

        const contactExists = await ContactsRepository.findById(id);

        if (!contactExists) {
            return response.status(404).json({ error: "Contact not found" });
        }

        if(email) {
            const contactHasEmail = await ContactsRepository.findByEmail(email);
            if (contactHasEmail && contactHasEmail.id !== id) {
                return response.status(400).json({ error: "E-mail already taken" });
            }
        }

        const contact = await ContactsRepository.update(id, {
            name,
            email: email || null,
            phone,
            category_id: category_id || null,
        });

        response.json(contact);
    }

    async delete(request, response) {
        // Deletar registro
        const { id } = request.params;

        if(!isValidUUID(id)) {
            return response.status(400).json({ error: "Invalid user id" });
        }

        await ContactsRepository.delete(id);

        // 204: No Content
        response.sendStatus(204);
    }
}

// Singleton
module.exports = new ContactController();
