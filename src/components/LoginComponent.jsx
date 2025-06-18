import { useState } from "react";
import { Button } from "../@/components/ui/button";
import { Input } from "../@/components/ui/input";
import { Label } from "../@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../@/components/ui/card";
import {
  Tabs,
  TabsContent,
} from "../@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogDescription,
} from "../@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const LoginComponent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();


  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const loginData = {};

    // Check if email or mobile is provided
    const emailOrMobile = formData.get("emailOrMobile");
    if (emailOrMobile.includes("@")) {
      loginData.email = emailOrMobile;
    } else {
      loginData.mobileNumber = emailOrMobile;
    }

    loginData.password = formData.get("password");

    try {

      console.log("Email: ", loginData.email);
      console.log("Password: ", loginData.password);

      if (loginData.email === process.env.REACT_APP_EMAIL && loginData.password === process.env.REACT_APP_PASSWORD) {

        // Store user data in AuthContext
        login(loginData.email);

        toast.success("Login Successfully!!")
        // Redirect to dashboard or home page
        navigate("/dashboard");
      } else {
        toast.error("Wrong Credentials!!");
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className="flex justify-center items-center p-4 bg-gray-50"
        style={{ height: "calc(100vh - 80.8px" }}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Login
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <AlertDialog variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDialogDescription>{error}</AlertDialogDescription>
              </AlertDialog>
            )}

            <Tabs defaultValue="password" className="w-full">

              <TabsContent value="password">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailOrMobile">Mobile Number</Label>
                    <Input
                      id="emailOrMobile"
                      name="emailOrMobile"
                      placeholder="Mobile Number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default LoginComponent;
