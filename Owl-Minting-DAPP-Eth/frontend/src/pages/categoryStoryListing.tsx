import { StoryListing } from "components";
import { Loader } from "components/common";
import { CheckAuthHook } from "hooks/adminHooks";
import { GetStoriesHook } from "hooks/categoryStories";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { resetcheckAuth } from "store/redux/slices/adminSlices/checkAuthSlice";
import { useAppDispatch } from "store/store";
import { CATEGOIRES } from "utility/constants";

const CategoryStoryListing = () => {
  const navigate = useNavigate();
  const dispatch =useAppDispatch();
  const token = localStorage.getItem('access_token')
  const { getStory, storiesLoading, stories, success } = GetStoriesHook();
  const { error, loading, auth } = CheckAuthHook();
  useEffect(() => {
    auth && getStory(CATEGOIRES);
  }, [auth]);

  useEffect(() => {
    (error || !token) && dispatch(resetcheckAuth()) && navigate("/admin-login");
  }, [error, token]);

  return (
    <div>
      {(!success && storiesLoading) || loading ? (
        <Loader content="Loading Stories" />
      ) : (
        <StoryListing />
      )}
    </div>
  );
};

export default CategoryStoryListing;
