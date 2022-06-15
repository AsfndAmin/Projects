import { ToastMessage } from "components/common"
import openNotification from "components/common/toastMessage"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { addStoryRequest, resetAddStory, resetSetStory, resetUpdateStory, updateStoryRequest } from "store/redux/slices/categoryStorySlices/addCategoryStory"
import { getStoriesRequest } from "store/redux/slices/categoryStorySlices/getCategoriesStory"
import { removeStoryRequest, resetRemoveStory } from "store/redux/slices/categoryStorySlices/removeCategoryStory"
import { useAppDispatch, useAppSelector } from "store/store"
import { CATEGOIRES } from "utility/constants"



export const GetStoriesHook = () => {

    const { stories, storiesError, storiesErrorMessage, success, storiesLoading } = useAppSelector(state => state.getCategoriesStory)
    const dispatch = useAppDispatch()

    const getStory = (categories: Array<string>) => {
        dispatch(getStoriesRequest({ categories: JSON.stringify(categories) }))
    }

    useEffect(() => {
        storiesError && openNotification('Error', 'Error fetching Stories', 'error')
    }, [storiesError])

    return {
        stories,
        storiesError,
        storiesErrorMessage,
        getStory,
        success,
        storiesLoading
    }

}

export const AddStoryHook = (setProductDialog) => {
    const { addStory, story } = useAppSelector(state => state.categoryStory)
    const { getStory } = GetStoriesHook()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const add = () => {
        dispatch(addStoryRequest(story))
    }

    useEffect(() => {
        if (addStory.result) {
            getStory(CATEGOIRES)
            dispatch(resetSetStory())
            setProductDialog(false)
            openNotification('Added', `${story.category}'s story added`, 'success')
            dispatch(resetAddStory())
        }
        if (addStory.error) {
            addStory.errorMessage.status == 401 && navigate('/admin-login')
            addStory.errorMessage.status == 505 && dispatch(resetAddStory()) && openNotification('Error', 'Somthing went wrong', 'error')
            addStory.errorMessage.status == 422 && openNotification('Error', addStory.errorMessage.error, 'error')
        }

    }, [addStory.result, addStory.error])

    return {
        add,
        addStory
    }
}

export const UpdateStoryHook = (setProductDialog) => {
    const { updateStory, story } = useAppSelector(state => state.categoryStory)
    const dispatch = useAppDispatch()
    const { getStory } = GetStoriesHook()
    const navigate = useNavigate()

    const update = () => {
        dispatch(updateStoryRequest(story))
    }

    useEffect(() => {
        if (updateStory.result) {
            dispatch(resetSetStory())
            setProductDialog(false)
            openNotification('Updated', `${story.category}'s story updated`, 'success')
            getStory(CATEGOIRES)
            dispatch(resetUpdateStory())
        }
        if (updateStory.error) {
            updateStory.errorMessage.status == 401 && navigate('/admin-login')
            updateStory.errorMessage.status == 505 && dispatch(resetUpdateStory()) && openNotification('Error', 'Somthing went wrong', 'error')
            updateStory.errorMessage.status == 422 && openNotification('Error', updateStory.errorMessage.error, 'error')
        }
    }, [updateStory.result, updateStory.error])

    return {
        update,
        updateStory
    }
}

export const RemoveStoryHook = (setProductDialog) => {
    const { story } = useAppSelector(state => state.categoryStory)
    const { result, error, errorMessage, loading } = useAppSelector(state => state.removeStory)
    const dispatch = useAppDispatch()
    const { getStory } = GetStoriesHook()
    const navigate = useNavigate()

    const remove = () => {
        dispatch(removeStoryRequest(story))
    }

    useEffect(() => {
        if (result) {
            openNotification('Deleted', `Story deleted successfully`, 'success')
            dispatch(resetSetStory())
            setProductDialog(false)
            getStory(CATEGOIRES)
        }
        if (error) {
            errorMessage.status == 401 && navigate('/admin-login')
            errorMessage.status == 505 && dispatch(resetRemoveStory()) && openNotification('Error', 'Somthing went wrong', 'error')
            errorMessage.status == 422 && openNotification('Error', errorMessage.error, 'error')
        }
    }, [result, error])

    return {
        remove,
        loading
    }
}