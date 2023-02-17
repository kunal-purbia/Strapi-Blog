'use strict';

module.exports = {
    kind: 'collectionType',
    collectionName: 'projects',
    info: {
        singularName: 'project', // kebab-case mandatory
        pluralName: 'projects', // kebab-case mandatory
        displayName: 'Project',
        description: 'All public repos of github profile',
    },
    options: {
        draftAndPublish: false,
    },
    attributes: {
        repositoryId: {
            type: "uid",
            unique: true,
        },
        title: {
            type: "string",
            required: true,
            unique: true,
        },
        shortDescription: {
            type: "string",
        },
        repositoryUrl: {
            type: "string",
        },
        longDescription: {
            type: "richtext",
        },
        coverImage: {
            type: "media",
            allowedTypes: ["images"],
            multiple: false            
        }
    }
};
