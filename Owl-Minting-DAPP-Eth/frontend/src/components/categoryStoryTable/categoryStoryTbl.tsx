import React, { useState, useRef, FormEvent, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { useAppDispatch, useAppSelector } from "store/store";
import InputField from "components/common/InputField/inputField";
import {
  resetSetStory,
  setStory,
} from "store/redux/slices/categoryStorySlices/addCategoryStory";
import useForm from "hooks/useForm";
import { storyValidate } from "components/validator";
import {
  AddStoryHook,
  UpdateStoryHook,
  GetStoriesHook,
  RemoveStoryHook,
} from "hooks/categoryStories";
import Dropdown from "components/common/dropdown/dropdown";
import { CATEGOIRES_DROPDOWN } from "utility/constants";
import { useNavigate } from "react-router-dom";
import "./table.css"
import { CommonUtility } from "utility/common";

type Props = {};

interface Body {
  _id: string;
  story: string;
  category: string;
  updatedAt: Date;
}

const CategoryTable: React.FC<Props> = () => {
  const token = localStorage.getItem("access_token");
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const { add, addStory } = AddStoryHook(setProductDialog);
  const { remove, loading } = RemoveStoryHook(setDeleteProductsDialog);
  const { update, updateStory } = UpdateStoryHook(setProductDialog);
  const { story } = useAppSelector((state) => state.categoryStory);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const toast = useRef<Toast>(null);
  const dispatch = useAppDispatch();
  const { stories } = useAppSelector((state) => state.getCategoriesStory);
  console.log(stories, "stories");

  const callEdit = (data: Body) => {
    dispatch(
      setStory({
        ...story,
        id: data._id,
        story: data.story,
        category: data.category,
        token,
        forUpdate: true,
      })
    );
    setProductDialog(true);
  };

  const hideDeleteProductDialog = () => {
    dispatch(resetSetStory());
    setDeleteProductsDialog(false);
  };

  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductDialog}
      />
      <Button
        label={loading ? "deleting..." : "delete"}
        icon="pi pi-check"
        disabled={loading ? true : false}
        className="p-button-text"
        onClick={() => remove()}
      />
    </React.Fragment>
  );

  const actionBodyTemplate = (rowData: Body) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => callEdit(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => {
            setDeleteProductsDialog(true);
            dispatch(
              setStory({
                ...story,
                id: rowData._id,
                category: rowData.category,
                token: token,
              })
            );
          }}
        />
      </React.Fragment>
    );
  };

  const openNew = () => {
    dispatch(setStory({ ...story, forUpdate: false, token }));
    setProductDialog(true);
  };

  const submit = () => {
    if (story.forUpdate) {
      update();
    } else {
      add();
    }
  };

  const { handleSubmit, errors } = useForm(submit, storyValidate, story);

  const hideDialog = () => {
    dispatch(resetSetStory());
    setProductDialog(false);
  };
  const navigate = useNavigate();

  useEffect(() => {
    errors && errors.token && navigate("/admin-login");
  }, [errors]);

  const productDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label={addStory.loading || updateStory.loading ? "saving..." : "Save"}
        icon="pi pi-check"
        disabled={addStory.loading || updateStory.loading ? true : false}
        onClick={handleSubmit}
      />
    </React.Fragment>
  );

  const header = (
    // Options for adding , deleting and exporting
    <div className="flex flex-column md:flex-row md:align-items-center justify-content-between">
      <span className="p-input-icon-left w-full md:w-auto">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e: any) =>{
            setGlobalFilter(e.target.value)
          }
           
          }
          placeholder="Search..."
          className="w-full lg:w-auto"
        />
      </span>
      <div className="mt-3 md:mt-0 flex justify-content-end">
        <Button
          icon="pi pi-plus"
          className="mr-2 p-button-rounded"
          onClick={openNew}
          tooltip="New"
          tooltipOptions={{ position: "bottom" }}
        />
      </div>
    </div>
  );
console.log(stories)
  return (
    <div className="datatable-crud-demo surface-card p-4 border-round shadow-2">
      <Toast ref={toast} />
      <div className="text-3xl text-800 font-bold mb-4">
        Stories Table
      </div>
      <DataTable
        value={stories? stories : []}
        dataKey="_id"
        paginator
       // globalFilterFields={["cate"]}
        rows={10}
        header={header}
        rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
        globalFilter={globalFilter}
        responsiveLayout="scroll"
      >
        <Column
          field="category"
          header="Category"
          sortable
          body={(data)=>CommonUtility.capitalizeFirstWord(data.category)}
          style={{ minWidth: "16rem" }}
        ></Column>
        <Column
          field="story"
          header="Story"
          sortable
          style={{ minWidth: "16rem" }}
        ></Column>
        <Column
          field="updatedAt"
          header="Updated At"
          sortable
          body={(data)=>CommonUtility.mm_dd_yy(data.updatedAt)}
          style={{ minWidth: "16rem" }}
        ></Column>
        <Column
          body={actionBodyTemplate}
          exportable={false}
          style={{ minWidth: "8rem" }}
        ></Column>
      </DataTable>

      <Dialog
        visible={productDialog}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "40vw" }}
        header="Product Details"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <Dropdown
          value={story.category}
          setValue={(e) =>
            dispatch(setStory({ ...story, category: e.target.value }))
          }
          inputLabel="Story"
          inputLabelText="Select category"
          options={CATEGOIRES_DROPDOWN}
          error={errors.category}
        />
        <InputField
          value={story.story}
          onChange={(e) =>
            dispatch(setStory({ ...story, story: e.target.value }))
          }
          inputType="text"
          inputLabel="Story"
          error={errors.story}
          maxLength={15}
          placeholder="Story"
        />
      </Dialog>

      <Dialog
        visible={deleteProductsDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
      >
        <div className="flex align-items-center justify-content-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {
            <span>
              Are you sure you want to delete <b>{story.category}</b>'s story?
            </span>
          }
        </div>
      </Dialog>
    </div>
  );
};

export default CategoryTable;
