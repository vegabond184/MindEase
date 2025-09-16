import streamlit as st
import requests

st.title("Chat App with Flask + Streamlit")

# Input from user
user_input = st.text_input("You:", "")

if st.button("Send") and user_input:
    response = requests.post("http://127.0.0.1:5000/chat", json={"message": user_input})
    reply = response.json().get("reply")
    st.write(f"**Bot:** {reply}")
