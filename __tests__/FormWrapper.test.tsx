import '@testing-library/jest-dom';
import { fireEvent, render, screen } from "@testing-library/react";
import FormWrapper from '../components/divami_components/form-wrapper/FormWrapper';
import { config } from "./Mocks/Formwrapper"

describe("Form Wrapper", () => {
  it("should render the form wrapper", () => {
    let validate = true;
    const setFormConfig = jest.fn().mockImplementation((callback: any) => { callback(config) })
    const setFormState = jest.fn()
    const setIsValidate = jest.fn()
    const setCanBeDisabled = jest.fn()
    const formState = { selectedValue: '' }
    render(<FormWrapper
      config={config}
      setFormConfig={setFormConfig}
      formState={formState}
      setFormState={setFormState}
      setIsValidate={setIsValidate}
      validate={validate}
      setCanBeDisabled={setCanBeDisabled}
    />)

    const input: any = screen.getByTestId("inputSelectField-issuePriority")
    fireEvent.click(input)
    const priorituEl = input.querySelector('input')
    fireEvent.change(priorituEl, { target: { value: 'High' } })
    fireEvent.keyDown(priorituEl, { key: 'ArrowDown' })
    fireEvent.keyDown(priorituEl, { key: 'Enter' })
    expect(input).toHaveTextContent('High')

    const issueTypeSelect: any = screen.getByTestId("inputSelectField-issueType")
    fireEvent.click(issueTypeSelect)
    const typeElement = issueTypeSelect.querySelector('input')
    fireEvent.change(typeElement, { target: { value: 'Safety' } })
    fireEvent.keyDown(typeElement, { key: 'ArrowDown' })
    fireEvent.keyDown(typeElement, { key: 'Enter' })
    expect(issueTypeSelect).toHaveTextContent('Safety')

    const testAreaInput: any = screen.getByTestId("inputTextAreaField-description")
    fireEvent.change(testAreaInput, { target: { value: "si" } })
    fireEvent.blur(testAreaInput, { target: { value: "si" } })
    expect(setFormConfig).toBeCalledWith(expect.any(Function))

    const fileInputEl = screen.getByTestId("inputFileField-file-upload")
    fireEvent.change(fileInputEl, { target: { files: ["file1", "file2"] } })
    expect(setFormConfig).toBeCalledWith(expect.any(Function))

    const fileContainer = screen.getByTestId("file-upload-container")
    fireEvent.click(fileContainer)
    expect(setFormConfig).toBeCalledWith(expect.any(Function))

    const customTagSuggestion: any = screen.getByTestId("custom-tag-suggestion").querySelector('input')
    fireEvent.change(customTagSuggestion, { target: { value: "si" } })
    fireEvent.keyDown(customTagSuggestion, { key: 'ArrowDown' })
    fireEvent.keyDown(customTagSuggestion, { key: 'Enter' })
    // expect(customTagSuggestion).toHaveTextContent('si')

    const searchEl: any = screen.getByTestId("search").querySelector('input')
    fireEvent.change(searchEl, { target: { value: "si" }, })
    fireEvent.keyDown(searchEl, { key: 'ArrowDown' })
    fireEvent.keyDown(searchEl, { key: 'Enter' })

    const datePickerEl: any = screen.getByTestId("custom-calender-parent-inputDateField-start-date").querySelector('input');
    fireEvent.change(datePickerEl, { target: { value: "" } })
    fireEvent.keyDown(searchEl, { key: 'Enter' })


  })
})