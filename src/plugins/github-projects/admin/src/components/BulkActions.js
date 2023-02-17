import React from 'react';
import { Box, Flex, Typography, Button } from '@strapi/design-system';

const BulkActions = ({ selectedRepos, createProjects, reloadPage }) => {
    const reposWithoutProject = selectedRepos.filter((repo) => !repo.projectId);
    const reposWithProject = selectedRepos.filter((repo) => repo.projectId);
    const projectsToBeCreated = reposWithoutProject.length;
    const projectsToBeDeleted = reposWithProject.length;
    return (
        <Box paddingBottom={4}>
            <Flex>
                <Typography>{`You have ${projectsToBeCreated} number of projects to be created and ${projectsToBeDeleted} number of projects to be deleted.`}</Typography>
                {projectsToBeCreated > 0 &&
                    (<Box paddingLeft={3}><Button
                        size="S"
                        variant="success-light"
                        onClick={() => {createProjects(reposWithoutProject); reloadPage();}}>
                        {`Creating ${projectsToBeCreated} projects`}
                    </Button></Box>)}

                {projectsToBeDeleted > 0 &&
                    (<Box paddingLeft={3}><Button
                        size="S"
                        variant="danger-light"
                        onClick={() => console.log("Bulk Deleted")}>
                        {`Deleting ${projectsToBeDeleted} projects`}
                    </Button></Box>)}
            </Flex>
        </Box>
    );
};

export default BulkActions;