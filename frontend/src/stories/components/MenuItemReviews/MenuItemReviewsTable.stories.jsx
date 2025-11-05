import React from "react";
import MenuItemReviewsTable from "main/components/MenuItemReviews/MenuItemReviewsTable";
import { menuItemReviewsFixtures } from "fixtures/menuItemReviewsFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/MenuItemReviews/MenuItemReviewsTable",
  component: MenuItemReviewsTable,
};

const Template = (args) => {
  return <MenuItemReviewsTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  menuItemReviews: [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  menuItemReviews: menuItemReviewsFixtures.threeReviews,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  menuItemReviews: menuItemReviewsFixtures.threeReviews,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/menuItemReviews", () => {
      return HttpResponse.json(
        { message: "MenuItemReview deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};
