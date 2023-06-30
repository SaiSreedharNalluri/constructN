import React, { useEffect, useState } from "react";
import Header from "../../components/divami_components/header/Header";
import * as Yup from "yup";
import { ErrorMessage, Form, Formik } from "formik";
import InputText from "../../components/core/Input/inputText";
import SubmitButtons from "../../components/core/buttons/submitButton";
import axios from "axios";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { CustomToast } from "../../components/divami_components/custom-toaster/CustomToast"
interface IProps {}

const Support: React.FC<IProps> = ({}) => {
  const router = useRouter();

  let [eMail, setEMail] = useState<string>("");
  const [ticketList, setTicketList] = useState<any>([]);
  const token = "jes6pOiqBm0pJC8s3DYC:X";
  const encodedToken = Buffer.from(token).toString("base64");
  const fresh_headers = {
    Authorization: "Basic " + encodedToken,
  };
  useEffect(() => {
    const userObj: any = getCookie("user");
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    if (user?.email) setEMail(user.email);
  }, [router.isReady]);

  useEffect(() => {
    if (eMail !== "")
      getMyTickets()
        .then((response) => {
          setTicketList(response);
        })
        .catch((error) => {
          CustomToast("failed to load data","error");
        });
  }, [eMail]);

  const validationSchema = Yup.object().shape({
    subject: Yup.string().required("Subject is required"),
    description: Yup.string().required("Description is required"),
  });

  const initialValues: {
    email: string;
    description: string;
    subject: string;
    priority: number;
    status: number;
    source: number;
  } = {
    email: eMail,
    description: "",
    subject: "",
    priority: 1,
    status: 2,
    source: 2,
  };
  const getMyTickets = () => {
    return axios
      .get(`https://constructnai.freshdesk.com/api/v2/tickets?email=${eMail}`, {
        headers: fresh_headers,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  };

  function openChat(): void {
    {
      eval(`globalThis.fcWidget.user.setEmail("${eMail}");`);
    }
    {
      eval(`globalThis.fcWidget.open()`);
    }
  }

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="flex">
        <div className=" self-center place-content-center flex-auto  w-2/3 overflow-auto">
          <div>
            <h2 className="text-center text-xl font-bold">Support</h2>
          </div>
          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, action) => {
                console.log("FormValues", values);
                values.email = eMail;
                axios
                  .post(
                    "https://constructnai.freshdesk.com/api/v2/tickets",
                    {
                      email: values.email,
                      subject: values.subject,
                      status: values.status,
                      priority: values.priority,
                      description: values.description,
                    },
                    { headers: fresh_headers }
                  )
                  .then((response) => {
                    console.log("Ticket Response", response);
                    if (response.data)
                      CustomToast("Ticket Created sucessfully","succcess");
                    setEMail(eMail);
                    return response.data;
                  })
                  .catch((error) => {
                    console.log("error", error);
                    throw error;
                  });
              }}
            >
              <Form className=" grid grid-cols-1 gap-y-2 px-4">
                <div className="collapse">
                  <InputText
                    type="email"
                    placeholderName={eMail}
                    name="email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div>
                  <InputText
                    type="text"
                    placeholderName="Subject"
                    name="subject"
                  />
                  <ErrorMessage
                    name="subject"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
                <div>
                  <InputText
                    type="text"
                    placeholderName="Description"
                    name="description"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
                <div>
                  <input type="hidden" id="status" />
                  <input type="hidden" id="priority" />
                  <input type="hidden" id="source" />
                </div>
                <div className="py-2 grid grid-cols-1 gap-2">
                  <SubmitButtons buttonName="Create Ticket" disabled={false} />
                </div>
              </Form>
            </Formik>
          </div>
          <div>
            <div
              id="custom_fc_button"
              className="absolute bg-orange-400 rounded-full left-0 bottom-4 w-4"
              onClick={openChat}
            >
              <button className="p-1" disabled={false}>
                Chat
              </button>
            </div>
          </div>
          {/* <div className="p-5 align-middle">
            <h2 className="text-center text-xl font-bold">My Tickets</h2>
            <ul className="border-solid border-spacing-1 border-2">
              <div className="grid grid-cols-5 divide-y-2 divide-x-2">
                {eMail !== '' &&
                  ticketList.map((ticket: any) => {
                    return (
                      <li key={ticket.id}>
                        <div className="flex flex-col">
                          <div>
                            <div className="text-xl flex font-bold">
                              #{ticket.id}
                            </div>
                            <div className="text-xl">{ticket.subject}</div>
                          </div>
                          <div className="rounded-full w-full justify-center  right-0 bg-neutral-400">
                            {ticket.status < 5 ? 'Open' : 'Closed'}
                          </div>
                        </div>
                      </li>
                    );
                  })}
              </div>
            </ul>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Support;
