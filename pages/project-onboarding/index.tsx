import ProjectOnboarding from '../../components/divami_components/project-onboarding/projectOnboarding'
import { OnBoardingContextProvider } from '../../state/projectState/context'

const Index=()=> {  
  return (
<div>
  <OnBoardingContextProvider>
  <ProjectOnboarding></ProjectOnboarding>
  </OnBoardingContextProvider>
</div>
  )
}

export default Index