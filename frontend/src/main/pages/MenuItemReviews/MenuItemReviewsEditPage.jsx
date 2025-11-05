import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router";
import MenuItemReviewsForm from "main/components/MenuItemReviews/MenuItemReviewsForm";
import { Navigate } from "react-router";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewsEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: menuItemReviews,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/menuitemreviews?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/menuitemreviews`,
      params: {
        id,
      },
    },
  );

  const objectToAxiosPutParams = (menuItemReviews) => ({
    url: "/api/menuitemreviews",
    method: "PUT",
    params: {
      id: menuItemReviews.id,
    },
    data: {
	  itemId: menuItemReviews.itemId,
      reviewerEmail: menuItemReviews.reviewerEmail,
      stars: menuItemReviews.stars,
	  dateReviewed: menuItemReviews.dateReviewed,
	  comments: menuItemReviews.comments
    },
  });

  const onSuccess = (menuItemReviews) => {
    toast(`Menu Item Reviews Updated - id: ${menuItemReviews.id}`);
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/menuitemreviews?id=${id}`],
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
        <h1>Edit Menu Item Review</h1>
        {menuItemReviews && (
          <MenuItemReviewsForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={menuItemReviews}
          />
        )}
      </div>
    </BasicLayout>
  );
}

