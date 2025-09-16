import streamlit as st
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
import time
# import random
st.set_page_config(page_title="First Chatbot Prototype")
# deepseek-ai/DeepSeek-R1
# meta-llama/Llama-3.1-8B-Instruct
# MindIntLab/PsycoLLM
st.title("MindSpace ChatBot")
llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    task="text-generation"
)

def stream_data(txt):
    for word in txt.split(" "):
        yield word + " "
        time.sleep(0.01)

model = ChatHuggingFace(llm=llm)

who_are_you = "you are an excellent psychologist your name is riya and you are from india and the length of your reply is according to the query"

# who_are_you = "you are an expert programer who can make anything"

if 'messages' not in st.session_state:
    st.session_state.messages = [SystemMessage(content = who_are_you)]

if 'user_input' not in st.session_state:
    st.session_state.user_input = []

if 'model_output' not in st.session_state:
    st.session_state.model_output = []



prompt = st.chat_input("Say something")


if prompt:

    # random_reply_time = random.randint(1,3)

    st.session_state.user_input.append(prompt)
    st.session_state.messages.append(HumanMessage(content=prompt))
    
    result = model.invoke(st.session_state.messages)
    st.session_state.model_output.append(result.content)
    st.session_state.messages.append(AIMessage(content=result.content))


    for _input in st.session_state.user_input:
        st.write(f":red[User:] {_input}")
        time.sleep(1)
        output = st.session_state.model_output[st.session_state.user_input.index(_input)]
        st.write(f":blue[Riya:] {output}")
        # st.write_stream(stream_data(output))

        



    

