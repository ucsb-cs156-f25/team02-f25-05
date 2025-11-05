import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MenuItemReviewsForm from "main/components/MenuItemReviews/MenuItemReviewsForm";
import { Navigate } from "react-router";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewsCreatePage({ storybook = false }) {
  const objectToAxiosParams = (menuItemReviews) => ({
    url: "/api/menuitemreviews/post",
    method: "POST",
    params: {
	  itemId: menuItemReviews.itemId,
      reviewerEmail: menuItemReviews.reviewerEmail,
      stars: menuItemReviews.stars,
	  dateReviewed: menuItemReviews.dateReviewed,
	  comments: menuItemReviews.comments
    },
  });

  const onSuccess = (menuItemReviews) => {
    toast(
      `New Menu Item Review Created - id: ${menuItemReviews.id}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/menuitemreviews/all"], // mutation makes this key stale so that pages relying on it reload
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/menuitemreviews" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Menu Item Review</h1>
        <MenuItemReviewsForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}

