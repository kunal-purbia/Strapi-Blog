import React, { useState } from "react";
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system';
import { Box, BaseCheckbox, Typography, Loader, Alert, Link, Flex, IconButton } from '@strapi/design-system';
import { Pencil, Trash, Plus } from '@strapi/Icons';
import axios from '../utils/axiosInstance';
import ConfirmationDialogue from "./ConfirmationDialogue";
import BulkActions from "./BulkActions";

const Repo = () => {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRepos, setSelectedRepos] = useState([]);
    const [alert, setAlert] = useState(undefined);
    const [deletingRepo, setDeletingRepo] = useState(undefined);

    const showAlert = (alert) => {
        setAlert(alert);
        setTimeout(() => {
            setAlert(undefined)
        }, 5000);
    }

    const createProject = async (repo) => {
        const response = await axios.post("/github-projects/project", repo);
        if (response && response.data) {
            setRepos(repos.map((item) => item.id !== repo.id ? item : {
                ...item,
                projectId: response.data.id
            }));

            showAlert({
                title: "Project created successfully",
                message: `Successfully created project ${response.data.title}`,
                variant: "success"
            })
        } else {
            showAlert({
                title: "Error occured",
                message: `Error while creating project. Please retry`,
                variant: "danger"
            })
        }
    }

    const reloadFunction = () => {window.location.reload(false);}

    const createAll = async (repos) => {
        const response = await axios.post("/github-projects/projects", { repos });
        console.log(response);
        if (response && response.data && response.data.length == repos.length) {
            setRepos(repos.map((repo) => {
                const relatedProjectsJustCreated = response.data.find((project) => project.repositoryId == repo.id);
                return !repo.projectId && relatedProjectsJustCreated ? {
                    ...repo,
                    projectId: relatedProjectsJustCreated.id
                } : repo
            }));

            showAlert({
                title: "Projects created successfully",
                message: `Successfully created ${response.data.length} projects`,
                variant: "success"
            })
        } else {
            showAlert({
                title: "Error occured",
                message: `Error while creating projects. Please retry`,
                variant: "danger"
            })
        }
        setSelectedRepos([]);
    }

    const deleteProject = async (repo) => {
        const { projectId } = repo;
        const response = await axios.delete(`/github-projects/project/${projectId}`);
        if (response && response.data) {
            setRepos(repos.map((item) => item.id !== repo.id ? item : {
                ...item,
                projectId: null
            }));

            showAlert({
                title: "Project deleted successfully",
                message: `Successfully deleted project ${response.data.title}`,
                variant: "success"
            })
        } else {
            showAlert({
                title: "Error occured",
                message: `Error while deleting project. Please retry`,
                variant: "danger"
            })
        }
    }

    const showDialogue = (repo) => {
        setDeletingRepo(repo);
    }

    useState(async () => {
        setLoading(true);
        axios.get("/github-projects/repos")
            .then((response) => setRepos(response.data))
            .catch((error) => showAlert({
                title: "Error fetching repository",
                message: error.toString(),
                variant: "danger"
            }));
        setLoading(false);
    }, []);

    if (loading) return <Loader />

    const allChecked = selectedRepos.length === repos.length;
    const isIndeterminate = selectedRepos.length > 0 && !allChecked;

    return (
        <Box padding={8} background="neutral100">
            {deletingRepo && (
                <ConfirmationDialogue
                    visible={!!deletingRepo}
                    message="Are you sure you want to delete this project?"
                    onClose={() => setDeletingRepo(undefined)}
                    onConfirm={() => deleteProject(deletingRepo)}
                />)}

            {selectedRepos.length > 0 && (
                <BulkActions
                    selectedRepos={selectedRepos.map((repoId) => repos.find((repo) => repo.id == repoId))}
                    createProjects={createAll}
                    reloadPage={reloadFunction}
                />)}

            <Table colCount={5} rowCount={repos.length}>
                <Thead>
                    <Tr>
                        <Th>
                            <BaseCheckbox aria-label="Select all entries" value={allChecked} indeterminate={isIndeterminate} onValueChange={value => value ? setSelectedRepos(repos.map((repo) => repo.id)) : setSelectedRepos([])} />
                        </Th>
                        <Th>
                            <Typography variant="sigma">NAME</Typography>
                        </Th>
                        <Th>
                            <Typography variant="sigma">DESCRIPTION</Typography>
                        </Th>
                        <Th>
                            <Typography variant="sigma">URL</Typography>
                        </Th>
                        <Th>
                            <Typography variant="sigma">ACTION</Typography>
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {repos.map(repo => {
                        const { id, name, shortDescription, url, projectId } = repo;
                        return (
                            <Tr key={id}>
                                <Td>
                                    <BaseCheckbox
                                        aria-label={`Select ${id}`}
                                        value={selectedRepos.includes(id)}
                                        onValueChange={(value) => {
                                            const newSelectedRepo = value ? [...selectedRepos, id] : selectedRepos.filter((item) => item !== id);
                                            setSelectedRepos(newSelectedRepo);
                                        }} />
                                </Td>
                                <Td>
                                    <Typography textColor="neutral800">{name}</Typography>
                                </Td>
                                <Td>
                                    <Typography textColor="neutral800">{shortDescription}</Typography>
                                </Td>
                                <Td>
                                    <Typography textColor="neutral800"><Link href={url} isExternal>{url}</Link></Typography>
                                </Td>
                                <Td>
                                    {
                                        projectId ? (
                                            <Flex>
                                                <Link to={`/content-manager/collectionType/plugin::github-projects.project/${projectId}}`}><IconButton label="Edit" noBorder icon={<Pencil />} /></Link>
                                                <Box paddingLeft={1}>
                                                    <IconButton onClick={() => showDialogue(repo)} label="Delete" noBorder icon={<Trash />} />
                                                </Box>
                                            </Flex>
                                        ) : (
                                            <IconButton onClick={() => createProject(repo)} label="Add" noBorder icon={<Plus />} />
                                        )
                                    }
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
            {alert && (
                <div style={{ position: "absolute", top: 0, left: "25%", zIndex: 10 }}>
                    <Alert closeLabel="Close Alert" title={alert.title} variant={alert.variant}>{alert.message}</Alert>
                </div>
            )}
        </Box>
    );
}

export default Repo;