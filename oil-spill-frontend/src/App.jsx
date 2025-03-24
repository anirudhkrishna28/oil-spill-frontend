import {Button,Spinner,FileUpload, Icon, Box } from "@chakra-ui/react"
import { LuUpload } from "react-icons/lu"
import MyFileUpload from "./MyFileUpload"
import ProtectedComponent from "./ProtectedComponent.jsx"
import PredictButton from "./PredictButton.jsx"
import GeneratePDF from "./GeneratePDF.jsx"

function App() {

  return (
    <>
    {/* <Button>click me</Button>
    <Spinner size = "sm"/>
    <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={10}>
      <FileUpload.HiddenInput />
      <FileUpload.Dropzone>
        <Icon size="md" color="fg.muted">
          <LuUpload />
        </Icon>
        <FileUpload.DropzoneContent>
          <Box>Drag and drop files here</Box>
          <Box color="fg.muted">.png, .jpg up to 5MB</Box>
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
      <FileUpload.List />
    </FileUpload.Root> */}
      <MyFileUpload />
      <PredictButton/>
      <GeneratePDF/>
        {/* <ProtectedComponent/>
         */}
         {/* <ProtectedComponent/> */}
    </>
  )
}

export default App
