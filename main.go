package main

import(
  "net/http"
  "flag"
  "github.com/gorilla/mux"
	"github.com/rs/cors"
  "os"
  "fmt"
  "time"
  "crypto/x509"
  "log"
  "crypto/tls"
  "bufio"
  "io/ioutil"
)

func ApiHandler(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json; charset=UTF-8")
  w.WriteHeader(http.StatusOK)
  defer r.Body.Close()

  //Create a new cert pool
	rootCAs := x509.NewCertPool()

	// Append our ca cert to the system pool
	if ok := rootCAs.AppendCertsFromPEM([]byte(*caPtr)); !ok {
		fmt.Println("No certs appended, using system certs only")
	}

  //Trust cert pool in our client
	clientConfig := &tls.Config{
		InsecureSkipVerify: false,
		RootCAs:            rootCAs,
	}
	clientTr := &http.Transport{TLSClientConfig: clientConfig}
	secureClient := &http.Client{Transport: clientTr, Timeout: time.Second * 5}

  //Setup Request
  strippedUri := r.RequestURI[4:len(r.RequestURI)]
  req, err := http.NewRequest(http.MethodPost, "https://" + server + ":48433" + strippedUri, r.Body)
  if err != nil {
    panic(err)
  }
  req.Header.Set("Account", account)
  req.Header.Set("Access-Key", accessKey)
  req.Header.Set("Secret-Key", secretKey)

  //Send Request
  resp, err := secureClient.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

  reader := bufio.NewReader(resp.Body)
  respBody, _ := ioutil.ReadAll(reader)
  w.Write(respBody)
}

var serverPtr = flag.String("server", "", "Server IP for the cluster. (Required)")
var caPtr = flag.String("ca", "", "CA cert for the cluster. (Required)")
var accountPtr = flag.String("account", "", "Sevice account name. (Required)")
var accessKeyPtr = flag.String("access-key", "", "Sevice account access key. (Required)")
var secretKeyPtr = flag.String("secret-key", "", "Sevice account secret key. (Required)")

var server string
var ca string
var account string
var accessKey string
var secretKey string


func main(){
  flag.Parse()

  if(*serverPtr == ""){
    if env := os.Getenv("MOZART_SERVER_IP"); env == "" {
      log.Fatal("Must provide IP to server.")
    } else {
      serverPtr = &env
      server = *serverPtr
    }
  } else {
    server = *serverPtr
  }

  if(*caPtr == ""){
    if env := os.Getenv("MOZART_CA"); env == "" {
      log.Fatal("Must provide a CA cert.")
    } else {
      caPtr = &env
      ca = *caPtr
    }
  } else {
    ca = *caPtr
  }

  if(*accountPtr == ""){
    if env := os.Getenv("MOZART_ACCOUNT"); env == "" {
      log.Fatal("Must provide a service account name.")
    } else {
      accountPtr = &env
      account = *accountPtr
    }
  } else {
    account = *accountPtr
  }

  if(*accessKeyPtr == ""){
    if env := os.Getenv("MOZART_ACCESS_KEY"); env == "" {
      log.Fatal("Must provide a service access key.")
    } else {
      accessKeyPtr = &env
      accessKey = *accessKeyPtr
    }
  } else {
    accessKey = *accessKeyPtr
  }

  if(*secretKeyPtr == ""){
    if env := os.Getenv("MOZART_SECRET_KEY"); env == "" {
      log.Fatal("Must provide a service secret key.")
    } else {
      secretKeyPtr = &env
      secretKey = *secretKeyPtr
    }
  } else {
    secretKey = *secretKeyPtr
  }

  router := mux.NewRouter().StrictSlash(true)

  //The below routes use a variable to trick it into catching all paths, therefore this will support 4 deep after /api
  router.HandleFunc("/api/{catch1}", ApiHandler)
  router.HandleFunc("/api/{catch1}/{catch2}", ApiHandler)
  router.HandleFunc("/api/{catch1}/{catch2}/{catch3}", ApiHandler)
  router.HandleFunc("/api/{catch1}/{catch2}/{catch3}/{catch4}", ApiHandler)
	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./app")))

  handler := cors.Default().Handler(router)
	err := http.ListenAndServe(":8000", handler)

  // server := &http.Server{
  //       Addr: ":" + "8000",
  //       Handler: handler,}
  //
  //
  // //Start server
  // //err = server.ListenAndServeTLS("", "")
  // err := server.ListenAndServe()
  log.Fatal(err)
}
